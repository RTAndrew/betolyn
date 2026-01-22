package com.betolyn.features.auth.signin;

import lombok.Data;

@Data
public class SignInRequestDTO {
    private String email;
    private String password;
}
