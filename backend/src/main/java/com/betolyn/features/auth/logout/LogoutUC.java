package com.betolyn.features.auth.logout;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.AuthSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutUC implements IUseCase<String, Void> {
    private final AuthSessionRepository authSessionRepository;

    @Override
    public Void execute(String sessionId) {
        authSessionRepository.deleteSession(sessionId);
        return null;
    }
}
