package com.betolyn.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Maps Render-style DATABASE_URL and REDIS_URL into Spring Boot properties
 * so the app works when deployed on Render (single Dockerfile, no compose).
 */
@SuppressWarnings("deprecation") // EnvironmentPostProcessor deprecated in Boot 4; still supported
public class RenderEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "renderEnv";
    // postgresql://USER:PASSWORD@HOST:PORT/DATABASE (password may contain : and @)
    private static final Pattern PG_URL = Pattern.compile("postgres(?:ql)?://([^:]+):([^@]+)@([^:]+):(\\d+)/(.+)");

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> props = new HashMap<>();

        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            parseDatabaseUrl(databaseUrl, props);
        }

        String redisUrl = environment.getProperty("REDIS_URL");
        if (redisUrl != null && !redisUrl.isBlank()) {
            parseRedisUrl(redisUrl, props);
        }

        if (!props.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, props));
        }
    }

    private void parseDatabaseUrl(String url, Map<String, Object> props) {
        if (url.startsWith("jdbc:")) return;
        try {
            Matcher m = PG_URL.matcher(url.trim());
            if (m.matches()) {
                String username = m.group(1);
                String password = m.group(2);
                String host = m.group(3);
                String port = m.group(4);
                String database = m.group(5).split("\\?")[0];
                props.put("spring.datasource.url", "jdbc:postgresql://" + host + ":" + port + "/" + database);
                props.put("spring.datasource.username", username);
                props.put("spring.datasource.password", password);
            }
        } catch (Exception ignored) {
            // leave Spring datasource from config/env as-is
        }
    }

    private void parseRedisUrl(String url, Map<String, Object> props) {
        try {
            URI uri = URI.create(url);
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 6379;
            if (host != null) {
                props.put("services.redis.host", host);
                props.put("services.redis.port", port);
            }
        } catch (Exception ignored) {
            // leave Redis config from application.yml as-is
        }
    }
}
