package com.betolyn.features.auth.dto;

import lombok.Data;

@Data
public class SignInRequestDTO {
    private String email;
    private String password;
}
