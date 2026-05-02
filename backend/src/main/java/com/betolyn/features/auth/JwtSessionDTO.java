package com.betolyn.features.auth;

import com.betolyn.features.user.UserRoleEnum;
import lombok.Data;

import java.time.Instant;
import java.util.Objects;

@Data
public class JwtSessionDTO {
    private String userId;
    private String username;
    private String email;
    private String sessionId;
    private String token;
    private UserRoleEnum role;

    private String iss;
    private String sub;
    private Instant exp;
    private Instant iat;

    public boolean matches(String token) {
        return Objects.equals(this.token, token);
    }
}
