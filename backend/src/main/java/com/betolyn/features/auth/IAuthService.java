package com.betolyn.features.auth;

import com.betolyn.features.auth.DTOs.SignInRequestDTO;
import com.betolyn.features.auth.DTOs.SignInResponseDTO;
import com.betolyn.features.auth.DTOs.SignUpRequestDTO;

import java.util.Optional;

public interface IAuthService {
    Optional<UserEntity> signUp(SignUpRequestDTO requestDTO);
    SignInResponseDTO signIn(SignInRequestDTO requestDTO);
}
