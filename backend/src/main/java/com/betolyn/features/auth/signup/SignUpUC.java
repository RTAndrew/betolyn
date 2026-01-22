package com.betolyn.features.auth.signup;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.exceptions.EmailAlreadyInUseException;
import com.betolyn.features.auth.exceptions.UsernameAlreadyInUseException;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SignUpUC implements IUseCase<SignUpRequestDTO, UserEntity> {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserEntity execute(SignUpRequestDTO requestDTO) {
        String email = requestDTO.getEmail();
        Optional<UserEntity> existsEmail = Optional.ofNullable(userRepository.findByEmail(email));
        Optional<UserEntity> existsUsername = Optional
                .ofNullable(userRepository.findByUsername(requestDTO.getUsername()));

        if (existsEmail.isPresent()) {
            throw new EmailAlreadyInUseException();
        }

        if (existsUsername.isPresent()) {
            throw new UsernameAlreadyInUseException();
        }

        requestDTO.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        var newUser = new UserEntity(requestDTO.getPassword(), email, requestDTO.getUsername());
        
        return userRepository.save(newUser);
    }
}
