package com.betolyn.features.auth.logout;

import com.betolyn.features.auth.AuthApiPaths;
import com.betolyn.features.auth.JwtSessionDTO;
import com.betolyn.features.auth.config.AuthConstants;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequiredArgsConstructor
public class Logout {
    private final LogoutUC logoutUC;
    private final AuthConstants authConstants;

    @GetMapping(AuthApiPaths.LOGOUT)
    public ResponseEntity<@NotNull ApiResponse<String>> logout(HttpServletResponse response) {
        var authenticationContext = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authenticationContext) || !authenticationContext.isAuthenticated()) {
            throw new AccessForbiddenException("AUTH_REQUIRED", "Authentication is required to access this resource");
        }

        JwtSessionDTO loggedUser = (JwtSessionDTO) authenticationContext.getPrincipal();

        if (loggedUser == null) {
            throw new AccessForbiddenException("AUTH_REQUIRED", "Authentication is required to access this resource");
        }

        logoutUC.execute(loggedUser.getSessionId());

        Cookie cookie = new Cookie(authConstants.cookiesTokenNameKey(), "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Session cleared successfully"));
    }
}
