package com.betolyn.config.database;

import com.betolyn.features.user.UserEntity;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditConfig {

    @Bean
    // Configures the Spring JPA Auditing to access the current logged user
    AuditorAware<UserEntity> auditorProvider() {
        return new AuditorAwareImpl();
    }

}