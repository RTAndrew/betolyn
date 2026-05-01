package com.betolyn.config.user;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.betolyn.features.user.UserRepository;
import com.betolyn.features.user.UserRoleEnum;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Upgrades listed users to {@link UserRoleEnum#PLATFORM_USER} on startup (local dev only).
 * Configure {@code app.auth.seed-platform-usernames} in {@code application-local.yml} as a
 * comma-separated list; usernames should match {@code seed/user-seed.json} in the repo root.
 */
@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class PlatformUserRoleSeedRunner implements ApplicationRunner {

    private final UserRepository userRepository;

    @Value("${app.auth.seed-platform-usernames:}")
    private String seedPlatformUsernames;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<String> usernames = parseUsernames(seedPlatformUsernames);
        if (usernames.isEmpty()) {
            return;
        }

        for (String username : usernames) {
            var user = userRepository.findByUsername(username);
            if (user == null) {
                log.warn("seed-platform-usernames: no user with username '{}', skipping", username);
                continue;
            }
            if (user.getRole() == UserRoleEnum.PLATFORM_USER) {
                continue;
            }
            user.setRole(UserRoleEnum.PLATFORM_USER);
            userRepository.save(user);
            log.info("Assigned PLATFORM_USER role to username '{}'", username);
        }
    }

    private static List<String> parseUsernames(String raw) {
        if (!StringUtils.hasText(raw)) {
            return List.of();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }
}
