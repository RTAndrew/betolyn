package com.betolyn.bootstrap.dev;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * On startup with profile {@code local}, assigns PLATFORM_USER to usernames from
 * {@code app.auth.seed-platform-usernames}. For {@code make db-reset}, the seed script calls
 * {@code POST /dev/seed-platform-user-roles} instead (reset profile has no users at JVM startup).
 */
@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class PlatformUserRoleSeedRunner implements ApplicationRunner {

    private final PlatformUserRoleAssignmentService platformUserRoleAssignmentService;

    @Override
    public void run(ApplicationArguments args) {
        int updated = platformUserRoleAssignmentService.assignPlatformRolesFromConfiguration();
        if (updated > 0) {
            log.info("Platform user startup seed: updated {} user(s)", updated);
        }
    }
}
