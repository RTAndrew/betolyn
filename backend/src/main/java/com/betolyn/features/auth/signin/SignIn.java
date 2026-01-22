package com.betolyn.features.auth.signin;

import com.betolyn.features.auth.AuthApiPaths;
import com.betolyn.features.auth.AuthMapper;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SignIn {
    private final SignInUC signInUC;
    private final AuthMapper authMapper;

    @PostMapping(AuthApiPaths.SIGNIN)
    public ResponseEntity<@NotNull ApiResponse<SignInResponseDTO>> signIn(@RequestBody SignInRequestDTO requestDTO,
            HttpServletResponse response) {
        var session = signInUC.execute(requestDTO);

        Cookie cookie = new Cookie("token", session.getToken());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(((int) session.getExp().getEpochSecond()));

        response.addCookie(cookie);
        response.addHeader("token", session.getToken());

        var responseData = authMapper.toSignInResponse(session);
        return ResponseEntity.ok().body(ApiResponse.success("user authenticated", responseData));
    }
}
