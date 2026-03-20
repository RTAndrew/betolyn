package com.betolyn.features.feedsync;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "betolyn.feed-shadow")
public class FeedShadowProperties {

    /** When true, run lightweight shadow logging after sync (no dual-write yet). */
    private boolean enabled = false;

    private boolean logDiffs = true;

    public boolean isEnabled() {
        return enabled;
    }

    public boolean isLogDiffs() {
        return logDiffs;
    }
}
