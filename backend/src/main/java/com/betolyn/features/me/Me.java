package com.betolyn.features.me;

import com.betolyn.features.auth.AuthMapper;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.signin.SignInResponseDTO;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class Me {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final AuthMapper authMapper;

    @RequestMapping(MeApiPaths.ME)
    public ResponseEntity<@NotNull ApiResponse<SignInResponseDTO>> validateSession() throws BadRequestException {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);

        var responseDTO = authMapper.toSignInResponse(loggedUser.session());
        return ResponseEntity.ok(ApiResponse.success("User session is valid", responseDTO));
    }
}
