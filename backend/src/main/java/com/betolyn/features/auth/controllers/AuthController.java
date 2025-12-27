package com.betolyn.features.auth.controllers;

import com.betolyn.features.auth.AuthService;
import com.betolyn.features.auth.UserEntity;
import com.betolyn.features.auth.UserService;
import com.betolyn.features.auth.dtos.SignInRequestDTO;
import com.betolyn.features.auth.dtos.SignInResponseDTO;
import com.betolyn.features.auth.dtos.SignUpRequestDTO;
import com.betolyn.features.auth.dtos.SignUpResponseDTO;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

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
    public ResponseEntity<ApiResponse> signUp(@RequestBody SignUpRequestDTO requestDTO) {
        Optional<UserEntity> savedUser = authService.signUp(requestDTO);

        if (savedUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("User already exists"));
        }

        SignUpResponseDTO responseDTO = new SignUpResponseDTO(savedUser.get().getId(),
                savedUser.get().getEmail(),
                savedUser.get().getUsername()
        );
        return ResponseEntity.ok(new ApiResponse<SignUpResponseDTO>("User account created", responseDTO));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> signIn(@RequestBody SignInRequestDTO requestDTO, HttpServletResponse response) {
        var user = authService.signIn(requestDTO);

        // TODO: set the MAX_AGE from the constants, and set it also in JwT.expiresAt
        Cookie cookie = new Cookie("token", user.getToken());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);

        response.addCookie(cookie);
        response.addHeader("token", user.getToken());

        return ResponseEntity.ok().body(new ApiResponse<SignInResponseDTO>("user authenticated", user));
    }
}
