package com.betolyn.features.feedsync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Placeholder for shadow compare / diff monitoring during cutover.
 * When {@link FeedShadowProperties#enabled}, logs a tick after each scheduled sync.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FeedShadowService {

    private final FeedShadowProperties feedShadowProperties;

    public void afterSyncTick() {
        if (!feedShadowProperties.isEnabled()) {
            return;
        }
        if (feedShadowProperties.isLogDiffs()) {
            log.info(
                    "feed_shadow: post-sync tick (structured diff vs legacy source not implemented — use flags + metrics)");
        }
    }
}
