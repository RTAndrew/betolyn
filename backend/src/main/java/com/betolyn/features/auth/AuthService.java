package com.betolyn.features.auth;

import com.betolyn.features.auth.dto.*;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRepository;
import com.betolyn.utils.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final AuthSessionRepository authSessionRepository;
    private final JwtTokenService jwtTokenService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<UserEntity> signUp(SignUpRequestDTO requestDTO) throws RuntimeException {
        String email = requestDTO.getEmail();
        Optional<UserEntity> existsEmail = Optional.ofNullable(userRepository.findByEmail(email));
        Optional<UserEntity> existsUsername = Optional.ofNullable(userRepository.findByUsername(requestDTO.getUsername()));
        if (existsEmail.isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        if (existsUsername.isPresent()) {
            throw new RuntimeException("Username already exists.");
        }

        requestDTO.setPassword(passwordEncoder.encode(requestDTO.getPassword()));

        UserEntity newUser = new UserEntity(requestDTO.getPassword(), email, requestDTO.getUsername());
        return Optional.of(userRepository.save(newUser));
    }

    @Override
    public JwtSessionDTO signIn(SignInRequestDTO requestDTO) throws RuntimeException {
        UserEntity foundUser = userRepository.findByEmail(requestDTO.getEmail());
        if (foundUser == null) {
            throw new RuntimeException("The credentials are invalid");
        }

        boolean passwordMatches = passwordEncoder.matches(requestDTO.getPassword(), foundUser.getPassword());
        if (!passwordMatches) throw new RuntimeException("The credentials are invalid");

        String sessionId = new UUID(8, "sess").generate();
        var session = jwtTokenService.generateToken(
                requestDTO.getEmail(),
                sessionId,
                foundUser.getUsername(),
                foundUser.getId()
        );

        authSessionRepository.saveSession(session);
        return session;
    }

    @Override
    public void logOut(String sessionId) {
        authSessionRepository.deleteSession(sessionId);
    }

    public boolean isSessionValid(JwtSessionDTO session) throws JwtException {
        return authSessionRepository.isSessionValid(session);
    }
}
