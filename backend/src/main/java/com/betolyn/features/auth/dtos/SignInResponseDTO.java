package com.betolyn.features.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignInResponseDTO {
    private SignUpResponseDTO user;
    private String token;
}
