package com.betolyn.features.auth.controllers;

import com.betolyn.features.auth.AuthMapper;
import com.betolyn.features.auth.AuthService;
import com.betolyn.features.auth.config.AuthConstants;
import com.betolyn.features.auth.dto.JwtSessionDTO;
import com.betolyn.features.auth.dto.SignInRequestDTO;
import com.betolyn.features.auth.dto.SignInResponseDTO;
import com.betolyn.features.auth.dto.SignUpRequestDTO;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthConstants authConstants;
    private final AuthMapper authMapper;

    @PostMapping("/signup")
    public ResponseEntity<@NotNull ApiResponse<UserDTO>> signUp(@RequestBody SignUpRequestDTO requestDTO) throws BadRequestException {
        Optional<UserEntity> savedUser = authService.signUp(requestDTO);

        if (savedUser.isEmpty()) {
            throw new BadRequestException("The entity could not be saved");
        }

        var responseDTO = authMapper.toSignUpResponse(savedUser.get());
        return ResponseEntity.ok(ApiResponse.success("User account created", responseDTO));
    }

    @PostMapping("/signin")
    public ResponseEntity<@NotNull ApiResponse<SignInResponseDTO>> signIn(@RequestBody SignInRequestDTO requestDTO, HttpServletResponse response) {
        var session = authService.signIn(requestDTO);

        Cookie cookie = new Cookie("token", session.getToken());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(((int) session.getExp().getEpochSecond()));

        response.addCookie(cookie);
        response.addHeader("token", session.getToken());

        var responseData = authMapper.toSignInResponse(session);
        return ResponseEntity.ok().body(ApiResponse.success("user authenticated", responseData));
    }

    @GetMapping("/logout")
    public ResponseEntity<@NotNull ApiResponse<String>> logout(HttpServletResponse response) {
        var authenticationContext = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authenticationContext) || !authenticationContext.isAuthenticated()) {
            throw new AccessForbiddenException("AUTH_REQUIRED", "Authentication is required to access this resource");
        }

        JwtSessionDTO loggedUser = (JwtSessionDTO) authenticationContext.getPrincipal();

        if (loggedUser == null) {
            throw new AccessForbiddenException("AUTH_REQUIRED", "Authentication is required to access this resource");
        }

        authService.logOut(loggedUser.getSessionId());

        Cookie cookie = new Cookie(authConstants.cookiesTokenNameKey(), "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Session cleared successfully"));
    }

}
