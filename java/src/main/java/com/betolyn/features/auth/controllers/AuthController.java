package com.betolyn.features.auth.controllers;

import com.betolyn.features.auth.dtos.SignUpRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping
    public SignUpRequestDTO signUp(@RequestBody SignUpRequestDTO data) {
        return data;
    }

}
