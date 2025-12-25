package com.betolyn.features.auth;

import com.betolyn.features.auth.dtos.SignInRequestDTO;
import com.betolyn.features.auth.dtos.SignInResponseDTO;
import com.betolyn.features.auth.dtos.SignUpRequestDTO;
import com.betolyn.features.auth.dtos.SignUpResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Override
    public Optional<UserEntity> signUp(SignUpRequestDTO requestDTO) throws RuntimeException {
        String email = requestDTO.getEmail();
        Optional<UserEntity> existsUser = Optional.ofNullable(userRepository.findByEmail(email));
        if (existsUser.isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        requestDTO.setPassword(passwordEncoder.encode(requestDTO.getPassword()));

        UserEntity newUser = new UserEntity(requestDTO.getPassword(), email, requestDTO.getUsername());
        return Optional.of(userRepository.save(newUser));
    }

    @Override
    public SignInResponseDTO signIn(SignInRequestDTO requestDTO) throws RuntimeException {
        UserEntity foundUser = userRepository.findByEmail(requestDTO.getEmail());
        if (foundUser == null) {
            throw new RuntimeException("The credentials are invalid");
        }


        boolean passwordMatches = passwordEncoder.matches(requestDTO.getPassword(), foundUser.getPassword());
        if (!passwordMatches) throw new RuntimeException("The credentials are invalid");

        String token = jwtTokenService.generateToken(requestDTO.getEmail(), requestDTO.getPassword());
        return new SignInResponseDTO(
                (new SignUpResponseDTO(foundUser.getId(), foundUser.getEmail(), foundUser.getEmail())),
                token);
    }
}
