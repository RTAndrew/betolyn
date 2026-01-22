package com.betolyn.features.auth.signup;

import com.betolyn.features.auth.AuthApiPaths;
import com.betolyn.features.auth.AuthMapper;
import com.betolyn.features.user.UserDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SignUp {
    private final SignUpUC signUpUC;
    private final AuthMapper authMapper;

    @PostMapping(AuthApiPaths.SIGNUP)
    public ResponseEntity<@NotNull ApiResponse<UserDTO>> signUp(@RequestBody SignUpRequestDTO requestDTO)
            throws BadRequestException {
        var savedUser = signUpUC.execute(requestDTO);

        if (savedUser == null) {
            throw new BadRequestException("The entity could not be saved");
        }

        var responseDTO = authMapper.toSignUpResponse(savedUser);
        return ResponseEntity.ok(ApiResponse.success("User account created", responseDTO));
    }
}
