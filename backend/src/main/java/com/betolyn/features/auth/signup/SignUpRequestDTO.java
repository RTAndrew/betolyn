package com.betolyn.features.auth.signup;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignUpRequestDTO {
    private String email;
    private String username;
    private String password;
}
