package com.betolyn.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.RedisClient;

@Configuration
public class RedisConfig {

    @Value("${services.redis.host}")
    private String HOST;
    @Value("${services.redis.port}")
    private Integer PORT;

    @Bean
    public RedisClient redis() {
        return RedisClient.builder().hostAndPort(HOST, PORT).build();
    }
}
