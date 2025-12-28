package com.betolyn.features.auth.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignUpResponseDTO {
    private String id;
    private String email;
    private String username;
}
