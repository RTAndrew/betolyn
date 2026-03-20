package com.betolyn.features.feedsync;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "betolyn.feed-sync")
public class FeedSyncProperties {

    /** When false, scheduled sync is a no-op. */
    private boolean enabled = false;

    /** Base URL of espn_service (no trailing slash), e.g. http://localhost:8010 */
    private String baseUrl = "http://localhost:8010";

    private int pageSize = 100;

    /**
     * When true, run a full sync once when the app finishes starting (does not require {@code enabled}).
     * Handy for manual runs: start the backend with this flag, then turn it off again.
     */
    private boolean runOnStartup = false;

    /**
     * When teams are missing during event sync, enqueue the league and POST espn_service ingest (teams +
     * recent scoreboards) before the next pull pass.
     */
    private boolean triggerIngestForPendingLeagues = true;

    /** UTC days of scoreboard ingest per queued league (1–30). */
    private int ingestHorizonDays = 7;

    /** Max ingest+sync rounds per run to avoid spinning if upstream keeps failing. */
    private int maxSyncPasses = 3;

    /**
     * HTTP connect timeout for the ESPN feed {@link org.springframework.web.client.RestClient} (seconds,
     * clamped 1–120).
     */
    private int httpConnectTimeoutSeconds = 10;

    /**
     * HTTP read timeout for the ESPN feed RestClient (seconds, clamped 5–600). Large pages / slow ingest
     * may need a higher value.
     */
    private int httpReadTimeoutSeconds = 120;

    public int effectivePageSize() {
        if (pageSize < 1) {
            return 100;
        }
        return Math.min(pageSize, 500);
    }

    /** Explicit for tooling / Lombok edge cases on @ConfigurationProperties. */
    public boolean isEnabled() {
        return enabled;
    }

    public boolean isRunOnStartup() {
        return runOnStartup;
    }

    public boolean isTriggerIngestForPendingLeagues() {
        return triggerIngestForPendingLeagues;
    }

    public int getIngestHorizonDays() {
        return ingestHorizonDays;
    }

    public int getMaxSyncPasses() {
        return maxSyncPasses;
    }

    public Duration effectiveHttpConnectTimeout() {
        return Duration.ofSeconds(Math.max(1, Math.min(httpConnectTimeoutSeconds, 120)));
    }

    public Duration effectiveHttpReadTimeout() {
        return Duration.ofSeconds(Math.max(5, Math.min(httpReadTimeoutSeconds, 600)));
    }
}
