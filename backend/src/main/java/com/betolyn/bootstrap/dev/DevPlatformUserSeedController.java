package com.betolyn.bootstrap.dev;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

/**
 * Dev-only: promotes configured seed usernames to PLATFORM_USER after signup (see {@code seed/seed.js}).
 * Enabled for {@code local} (normal dev), {@code reset} ({@code make db-reset}), and Spring's
 * {@code default} profile (common IntelliJ run config without explicit profile).
 */
@RestController
@RequestMapping("/dev")
@Profile({ "local", "reset", "default" })
@RequiredArgsConstructor
public class DevPlatformUserSeedController {

    private final PlatformUserRoleAssignmentService platformUserRoleAssignmentService;

    @PostMapping("/seed-platform-user-roles")
    public ResponseEntity<ApiResponse<Integer>> seedPlatformUserRoles() {
        int updated = platformUserRoleAssignmentService.assignPlatformRolesFromConfiguration();
        return ResponseEntity.ok(ApiResponse.success(
                "PLATFORM_USER role assigned where configured", updated));
    }
}
