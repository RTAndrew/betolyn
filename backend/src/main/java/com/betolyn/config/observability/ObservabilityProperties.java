package com.betolyn.config.observability;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.observability")
public record ObservabilityProperties(SqlCount sqlCount) {

    public record SqlCount(boolean enabled) {
        public SqlCount {
            // default when property block is omitted
        }

        public SqlCount() {
            this(false);
        }
    }

    public ObservabilityProperties {
        if (sqlCount == null) {
            sqlCount = new SqlCount();
        }
    }
}
