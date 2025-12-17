package com.betolyn.features.auth;

import com.betolyn.features.auth.dtos.SignInRequestDTO;
import com.betolyn.features.auth.dtos.SignUpRequestDTO;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;

    @Override
    public void signUp(SignUpRequestDTO requestDTO) {
        var email = requestDTO.getEmail();
        var existsUser = Optional.ofNullable(userRepository.findByEmail(email));
        if (existsUser.isEmpty()) {
            return;
        }

        userRepository.save(new UserEntity("id", requestDTO.getPassword(), email));
    }

    @Override
    public void signIn(SignInRequestDTO requestDTO) {
        throw new UnsupportedOperationException();
    }
}
