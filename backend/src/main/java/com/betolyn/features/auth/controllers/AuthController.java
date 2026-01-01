package com.betolyn.features.auth.controllers;

import com.betolyn.features.auth.AuthMapper;
import com.betolyn.features.auth.AuthService;
import com.betolyn.features.auth.config.AuthConstants;
import com.betolyn.features.auth.dto.*;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserService;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;
    private final AuthConstants authConstants;
    private final AuthMapper authMapper;

    @GetMapping
    public List<UserEntity> listUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable("userId") String userId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Product created", userService.getUserById(userId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Not found"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<@NotNull ApiResponse<UserDTO>> signUp(@RequestBody SignUpRequestDTO requestDTO) {
        Optional<UserEntity> savedUser = authService.signUp(requestDTO);

        if (savedUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("User already exists"));
        }

        var responseDTO = authMapper.toSignUpResponse(savedUser.get());
        return ResponseEntity.ok(new ApiResponse<>("User account created", responseDTO));
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
        return ResponseEntity.ok().body(new ApiResponse<SignInResponseDTO>("user authenticated", responseData));
    }

    @GetMapping("/logout")
    public ResponseEntity<@NotNull ApiResponse<String>> logout(HttpServletResponse response) {
        var authenticationContext = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authenticationContext) || !authenticationContext.isAuthenticated()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("You must be logged in to access this resource"));
        }

        JwtSessionDTO loggedUser = (JwtSessionDTO) authenticationContext.getPrincipal();

        if(loggedUser == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("You must be logged in to access this resource"));
        }

        authService.logOut(loggedUser.getSessionId());

        Cookie cookie = new Cookie(authConstants.cookiesTokenNameKey(), "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(new ApiResponse<>("Session cleared successfully"));
    }

}
