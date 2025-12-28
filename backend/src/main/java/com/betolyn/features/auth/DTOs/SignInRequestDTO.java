package com.betolyn.features.auth.DTOs;

import lombok.Data;

@Data
public class SignInRequestDTO {
    private String email;
    private String password;
}
