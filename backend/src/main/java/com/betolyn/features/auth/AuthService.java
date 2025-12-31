package com.betolyn.features.auth;

import com.betolyn.features.auth.dto.*;
import com.betolyn.utils.GenerateId;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
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

        String sessionId = new GenerateId(8,"sess").generate();
        String token = jwtTokenService.generateToken(requestDTO.getEmail(), sessionId, foundUser.getUsername(), foundUser.getId());

        Map<String, String> session = new HashMap<>();
        session.put("email", foundUser.getEmail());
        session.put("username", foundUser.getUsername());
        session.put("id", foundUser.getId());
        authSessionRepository.saveSession(sessionId, session);

        return new SignInResponseDTO(
                (new SignUpResponseDTO(foundUser.getId(), foundUser.getEmail(), foundUser.getUsername())),
                token, sessionId);
    }

    public boolean isSessionValid(JwtSessionDTO session) throws JwtException {
        return authSessionRepository.isSessionValid(session);
    }


}
