package com.betolyn.features.auth;

import com.betolyn.features.auth.dto.JwtSessionDTO;
import com.betolyn.features.auth.dto.SignInRequestDTO;
import com.betolyn.features.auth.dto.SignInResponseDTO;
import com.betolyn.features.auth.dto.SignUpRequestDTO;

import java.util.Optional;

public interface IAuthService {
    Optional<UserEntity> signUp(SignUpRequestDTO requestDTO);
    SignInResponseDTO signIn(SignInRequestDTO requestDTO);
    boolean isSessionValid(JwtSessionDTO data);
}
