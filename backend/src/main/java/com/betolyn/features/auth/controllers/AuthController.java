package com.betolyn.features.auth.controllers;

import com.betolyn.features.ApiResponse;
import com.betolyn.features.auth.UserEntity;
import com.betolyn.features.auth.UserService;
import com.betolyn.features.auth.dtos.SignUpRequestDTO;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;


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

    @PostMapping
    public SignUpRequestDTO signUp(@RequestBody SignUpRequestDTO data) {
        return data;
    }
}
