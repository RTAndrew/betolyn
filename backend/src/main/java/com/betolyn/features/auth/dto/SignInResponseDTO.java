package com.betolyn.features.auth.dto;

import com.betolyn.features.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignInResponseDTO {
    private UserDTO user;
    private String token;
    private String sessionId;
}
