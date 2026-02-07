package com.betolyn.features.auth;

import com.betolyn.features.IUseCaseNoParams;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class GetAuthenticatedUserUC implements IUseCaseNoParams {


    @Override
    public Optional<JwtSessionDTO> execute() {
        var authenticationContext = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authenticationContext) || !authenticationContext.isAuthenticated()) {
            return Optional.empty();
        }

        JwtSessionDTO loggedUser = (JwtSessionDTO) authenticationContext.getPrincipal();

        if (loggedUser == null) {
            return Optional.empty();
        }

        return Optional.of(loggedUser);
    }
}
