package com.betolyn.features.feedsync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.ingestion", name = "enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class FeedSyncScheduler {

    private final FeedSyncService feedSyncService;

    @Scheduled(cron = "${app.ingestion.cron:0 */5 * * * *}")
    public void runFeedSync() {
        log.debug("feed_sync_scheduled_tick");
        feedSyncService.runScheduledSync();
    }
}
