package com.betolyn.features.feedsync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * One-shot sync after the context is up. Enable with {@code betolyn.feed-sync.run-on-startup=true}.
 */
@Component
@ConditionalOnProperty(prefix = "betolyn.feed-sync", name = "run-on-startup", havingValue = "true")
@Order(1000)
@RequiredArgsConstructor
@Slf4j
public class FeedSyncStartupRunner implements ApplicationRunner {

    private final FeedSyncService feedSyncService;

    @Override
    public void run(ApplicationArguments args) {
        log.info("feed_sync_run_on_startup");
        feedSyncService.runSyncNow();
    }
}
