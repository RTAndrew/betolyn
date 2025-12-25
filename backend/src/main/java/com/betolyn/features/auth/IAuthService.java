package com.betolyn.features.auth;

import com.betolyn.features.auth.dtos.SignInRequestDTO;
import com.betolyn.features.auth.dtos.SignInResponseDTO;
import com.betolyn.features.auth.dtos.SignUpRequestDTO;

import java.util.Optional;

public interface IAuthService {
    Optional<UserEntity> signUp(SignUpRequestDTO requestDTO);
    SignInResponseDTO signIn(SignInRequestDTO requestDTO);
}
