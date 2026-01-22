package com.betolyn.features.auth.validatesession;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.AuthSessionRepository;
import com.betolyn.features.auth.dto.JwtSessionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidateSessionUC implements IUseCase<JwtSessionDTO, Boolean> {
    private final AuthSessionRepository authSessionRepository;

    @Override
    public Boolean execute(JwtSessionDTO session) throws JwtException {
        return authSessionRepository.isSessionValid(session);
    }
}
