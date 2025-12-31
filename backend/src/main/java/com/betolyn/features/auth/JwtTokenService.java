package com.betolyn.features.auth;

import com.betolyn.features.auth.config.AuthConstants;
import com.betolyn.features.auth.dto.JwtSessionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final AuthConstants authConstants;
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public JwtSessionDTO generateToken(String email, String sessionId, String username, String userId) {
        Instant now = Instant.now();
        var expiresAt = now.plus(authConstants.sessionExpirationInDays(), ChronoUnit.DAYS);
        var issuer = "betolyn";

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject("user")
                .claim("email", email)
                .claim("user_id", userId)
                .claim("username", username)
                .claim("session_id", sessionId)
                .build();
        var encoderParameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims);
        var generatedToken = this.encoder.encode(encoderParameters).getTokenValue();

        JwtSessionDTO session = new JwtSessionDTO();
        session.setIss(issuer);
        session.setSessionId(sessionId);
        session.setEmail(email);
        session.setUsername(username);
        session.setUserId(userId);
        session.setExp(expiresAt);
        session.setToken(generatedToken);
        return session;
    }

    public boolean isValid(String token) {
        try {
            var decodedToken = this.decoder.decode(token);
            return Objects.equals(decodedToken.getTokenValue(), token);
        } catch (JwtException e) {
            return false;
        }

    }

    public JwtSessionDTO decode(String token) throws JwtException {
        var decodedToken = this.decoder.decode(token);

        var jwtDTO = new JwtSessionDTO();
        jwtDTO.setUserId(decodedToken.getClaim("user_id"));
        jwtDTO.setUsername(decodedToken.getClaim("username"));
        jwtDTO.setSessionId(decodedToken.getClaim("session_id"));
        jwtDTO.setEmail(decodedToken.getClaim("email"));
        jwtDTO.setIss(decodedToken.getClaim("iss"));
        jwtDTO.setIat(decodedToken.getClaim("iat"));

        return jwtDTO;
    }
}