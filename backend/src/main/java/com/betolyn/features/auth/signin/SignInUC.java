package com.betolyn.features.auth.signin;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.AuthSessionRepository;
import com.betolyn.features.auth.JwtSessionDTO;
import com.betolyn.features.auth.JwtTokenService;
import com.betolyn.features.auth.exceptions.InvalidCredentialsException;
import com.betolyn.features.user.UserRepository;
import com.betolyn.utils.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignInUC implements IUseCase<SignInRequestDTO, JwtSessionDTO> {
    private final UserRepository userRepository;
    private final AuthSessionRepository authSessionRepository;
    private final JwtTokenService jwtTokenService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public JwtSessionDTO execute(SignInRequestDTO requestDTO) {
        var foundUser = userRepository.findByEmail(requestDTO.getEmail().toLowerCase());
        if (foundUser == null) {
            throw new InvalidCredentialsException();
        }

        boolean passwordMatches = passwordEncoder.matches(requestDTO.getPassword(), foundUser.getPassword());
        if (!passwordMatches) {
            throw new InvalidCredentialsException();
        }

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
}
