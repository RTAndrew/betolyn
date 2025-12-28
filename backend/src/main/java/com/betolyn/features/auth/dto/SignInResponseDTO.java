package com.betolyn.features.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignInResponseDTO {
    private SignUpResponseDTO user;
    private String token;
    private String sessionId;
}
