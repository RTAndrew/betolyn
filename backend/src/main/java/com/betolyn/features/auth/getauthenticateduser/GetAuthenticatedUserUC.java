package com.betolyn.features.auth.getauthenticateduser;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.auth.JwtSessionDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.features.user.finduserbyid.FindUserByIdUC;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;



@Service
@RequiredArgsConstructor
public class GetAuthenticatedUserUC implements IUseCaseNoParams {
    private final FindUserByIdUC findUserByIdUC;
    private final UserMapper userMapper;

    @Override
    public Optional<AuthenticatedUserDTO> execute() {
        var authenticationContext = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authenticationContext) || !authenticationContext.isAuthenticated()) {
            return Optional.empty();
        }

        JwtSessionDTO loggedUser = (JwtSessionDTO) authenticationContext.getPrincipal();

        if (loggedUser == null) {
            return Optional.empty();
        }

        var user = findUserByIdUC.execute(loggedUser.getUserId());

        return Optional.of(new AuthenticatedUserDTO(user, loggedUser));
    }
}
