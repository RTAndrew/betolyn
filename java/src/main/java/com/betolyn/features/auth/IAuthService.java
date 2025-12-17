package com.betolyn.features.auth;

import com.betolyn.features.auth.dtos.SignInRequestDTO;
import com.betolyn.features.auth.dtos.SignUpRequestDTO;

public interface IAuthService {
    void signUp(SignUpRequestDTO requestDTO);
    void signIn(SignInRequestDTO requestDTO);
}
