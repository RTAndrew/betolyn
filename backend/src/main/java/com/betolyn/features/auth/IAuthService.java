package com.betolyn.features.auth;

import com.betolyn.features.auth.dto.JwtSessionDTO;
import com.betolyn.features.auth.dto.SignInRequestDTO;
import com.betolyn.features.auth.dto.SignUpRequestDTO;
import com.betolyn.features.user.UserEntity;

import java.util.Optional;

public interface IAuthService {
    Optional<UserEntity> signUp(SignUpRequestDTO requestDTO);
    JwtSessionDTO signIn(SignInRequestDTO requestDTO);
    boolean isSessionValid(JwtSessionDTO data);
    void logOut(String sessionId);
}
