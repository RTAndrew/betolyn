package com.betolyn.features.auth;

import com.betolyn.features.auth.dto.JwtSessionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import redis.clients.jedis.RedisClient;

import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AuthSessionRepository {
    private static final String AUTH_SESSION_KEY = "auth:session";
    private final RedisClient redis;

    private String getAuthSessionKey(String sessionId) {
        return AUTH_SESSION_KEY + ":" + sessionId;
    }

    public boolean isSessionValid(JwtSessionDTO session) {
        var redisSession = redis.hgetAll(getAuthSessionKey(session.getSessionId()));
        var userId = redisSession.get("id");
        var email = redisSession.get("email");
        var username = redisSession.get("username");

        return session.getEmail().equals(email) &&
                session.getUserId().equals(userId) &&
                session.getUsername().equals(username);
    }

    public void saveSession(String sessionId, Map<String, String> data) {
        String authSessionKey = getAuthSessionKey(sessionId);

        // TODO: set a default expiration with HSETEX
        redis.hset(authSessionKey, data);

    }
}
