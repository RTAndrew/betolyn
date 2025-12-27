package com.betolyn.features.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import redis.clients.jedis.RedisClient;

import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AuthSessionRepository {
    private static final String AUTH_SESSION_KEY = "auth:session";
    private final RedisClient redis;

    public String getAuthSessionKey(String sessionId) {
        return AUTH_SESSION_KEY + ":" + sessionId;
    }

    public void saveSession(String sessionId, Map<String, String> data) {

        String authSessionKey = getAuthSessionKey(sessionId);

        // TODO: set a default expiration with HSETEX
        redis.hset(authSessionKey, data);

    }
}
