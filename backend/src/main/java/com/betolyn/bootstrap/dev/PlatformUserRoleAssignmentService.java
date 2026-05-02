package com.betolyn.bootstrap.dev;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.betolyn.features.user.UserRepository;
import com.betolyn.features.user.UserRoleEnum;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Assigns {@link UserRoleEnum#PLATFORM_USER} to configured usernames (comma-separated).
 * Used at startup (local profile) and via {@link DevPlatformUserSeedController} during DB reset seed.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformUserRoleAssignmentService {

    private final UserRepository userRepository;

    @Value("${app.auth.seed-platform-usernames:}")
    private String seedPlatformUsernames;

    /**
     * @return number of users whose role was changed to PLATFORM_USER
     */
    @Transactional
    public int assignPlatformRolesFromConfiguration() {
        List<String> usernames = parseUsernames(seedPlatformUsernames);
        if (usernames.isEmpty()) {
            return 0;
        }

        int updated = 0;
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
            updated++;
        }
        return updated;
    }

    static List<String> parseUsernames(String raw) {
        if (!StringUtils.hasText(raw)) {
            return List.of();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }
}
