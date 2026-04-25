package com.betolyn.features.feedsync;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Instant;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedSyncService {

    private final FeedSyncProperties feedSyncProperties;
    private final FeedShadowProperties feedShadowProperties;
    private final IngestionStateRepository ingestionStateRepository;
    private final RestClient espnFeedSyncRestClient;
    private final FeedSyncBatchService feedSyncBatchService;
    private final FeedShadowService feedShadowService;
    private final FeedIngestTriggerService feedIngestTriggerService;
    private final ObjectMapper objectMapper;

    public void runScheduledSync() {
        if (!feedSyncProperties.isEnabled()) {
            return;
        }
        runSyncNow();
    }

    /**
     * Pull teams + events (and optional shadow tick). Ignores {@code app.ingestion.enabled} — use for
     * one-shot runs ({@code run-on-startup}) or future admin tooling.
     */
    public void runSyncNow() {
        int passes = Math.max(1, Math.min(feedSyncProperties.getMaxSyncPasses(), 10));
        for (int i = 0; i < passes; i++) {
            feedIngestTriggerService.processAllPending();
            syncTeams();
            syncEvents();
            if (!feedIngestTriggerService.hasPending()) {
                break;
            }
        }

        if (feedShadowProperties.isEnabled()) {
            feedShadowService.afterSyncTick();
        }
    }

    private void syncTeams() {
        IngestionStateEntity state = loadState(IngestionStateEntity.SOURCE_TEAMS);
        state.setLastRunStartedAt(Instant.now());
        state.setLastError(null);
        ingestionStateRepository.save(state);

        try {
            fetchAllPages("/api/sync/v1/teams", state, body -> feedSyncBatchService.applyTeamBatch(body, state));
            state.setLastRunCompletedAt(Instant.now());
            state.setLastError(null);
        } catch (Exception e) {
            log.error("feed_sync_teams_failed", e);
            state.setLastError(truncate(e.getMessage(), 4000));
        } finally {
            state.setRowUpdatedAt(Instant.now());
            ingestionStateRepository.save(state);
        }
    }

    private void syncEvents() {
        IngestionStateEntity state = loadState(IngestionStateEntity.SOURCE_EVENTS);
        state.setLastRunStartedAt(Instant.now());
        state.setLastError(null);
        ingestionStateRepository.save(state);

        try {
            fetchAllPages(
                    "/api/sync/v1/events",
                    state,
                    body -> feedSyncBatchService.applyEventBatch(body, state));
            state.setLastRunCompletedAt(Instant.now());
            state.setLastError(null);
        } catch (Exception e) {
            log.error("feed_sync_events_failed", e);
            state.setLastError(truncate(e.getMessage(), 4000));
        } finally {
            state.setRowUpdatedAt(Instant.now());
            ingestionStateRepository.save(state);
        }
    }

    private IngestionStateEntity loadState(String source) {
        return ingestionStateRepository
                .findById(source)
                .orElseThrow(() -> new IllegalStateException("Missing ingestion_state row: " + source));
    }

    private void fetchAllPages(String path, IngestionStateEntity state, PageConsumer consumer) throws Exception {
        boolean hasMore = true;
        while (hasMore) {
            URI uri = buildUri(path, state);
            String json;
            try {
                json = Objects.requireNonNull(espnFeedSyncRestClient.get().uri(uri).retrieve().body(String.class));
            } catch (RestClientException e) {
                throw new IllegalStateException("HTTP sync failed: " + path + " — " + e.getMessage(), e);
            }
            JsonNode root = objectMapper.readTree(json);
            hasMore = root.path("has_more").asBoolean(false);
            JsonNode results = root.get("results");
            consumer.accept(results);
            if (results == null || !results.isArray() || results.isEmpty()) {
                break;
            }
        }
    }

    private URI buildUri(String path, IngestionStateEntity state) {
        UriComponentsBuilder b = UriComponentsBuilder.fromPath(path)
                .queryParam("limit", feedSyncProperties.effectivePageSize());
        if (state.getWatermarkUpdatedAt() != null && state.getWatermarkRowId() != null) {
            b.queryParam("after_updated_at", state.getWatermarkUpdatedAt().toString());
            b.queryParam("after_id", state.getWatermarkRowId());
        }
        return b.build().encode().toUri();
    }

    private static String truncate(String s, int max) {
        if (s == null) {
            return null;
        }
        return s.length() <= max ? s : s.substring(0, max);
    }

    @FunctionalInterface
    private interface PageConsumer {
        void accept(JsonNode results) throws Exception;
    }
}
