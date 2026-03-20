package com.betolyn.features.feedsync;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Calls espn_service write ingest API so missing teams/events exist upstream before read sync.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FeedIngestTriggerService {

    private static final DateTimeFormatter YYYYMMDD = DateTimeFormatter.BASIC_ISO_DATE;

    private final RestClient espnFeedSyncRestClient;
    private final FeedSyncProperties feedSyncProperties;
    private final PendingLeagueSyncRepository pendingLeagueSyncRepository;

    /**
     * Process all queued leagues: POST teams + scoreboard for the last {@link FeedSyncProperties#getIngestHorizonDays()} UTC days.
     */
    public void processAllPending() {
        if (!feedSyncProperties.isTriggerIngestForPendingLeagues()) {
            return;
        }
        var pending = pendingLeagueSyncRepository.findAll();
        for (var row : pending) {
            try {
                triggerLeagueIngest(row.getSportSlug(), row.getLeagueSlug());
                pendingLeagueSyncRepository.delete(row);
                log.info(
                        "feed_ingest_league_done sport={} league={}",
                        row.getSportSlug(),
                        row.getLeagueSlug());
            } catch (Exception e) {
                log.error(
                        "feed_ingest_league_failed sport={} league={}",
                        row.getSportSlug(),
                        row.getLeagueSlug(),
                        e);
            }
        }
    }

    public boolean hasPending() {
        return pendingLeagueSyncRepository.count() > 0;
    }

    public void enqueueIfAbsent(String sportSlug, String leagueSlug) {
        if (!feedSyncProperties.isTriggerIngestForPendingLeagues()) {
            return;
        }
        if (sportSlug == null
                || sportSlug.isBlank()
                || leagueSlug == null
                || leagueSlug.isBlank()) {
            return;
        }
        String s = sportSlug.trim().toLowerCase();
        String l = leagueSlug.trim().toLowerCase();
        if (pendingLeagueSyncRepository.existsBySportSlugAndLeagueSlug(s, l)) {
            return;
        }
        var e = new PendingLeagueSyncEntity();
        e.setId(PendingLeagueSyncEntity.compositeId(s, l));
        e.setSportSlug(s);
        e.setLeagueSlug(l);
        e.setRequestedAt(java.time.Instant.now());
        pendingLeagueSyncRepository.save(e);
        log.info("feed_sync_league_queued_for_ingest sport={} league={}", s, l);
    }

    private void triggerLeagueIngest(String sport, String league) {
        postJson("/api/v1/ingest/teams/", Map.of("sport", sport, "league", league));
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        int days = Math.max(1, Math.min(feedSyncProperties.getIngestHorizonDays(), 30));
        for (int i = 0; i < days; i++) {
            String date = today.minusDays(i).format(YYYYMMDD);
            postJson(
                    "/api/v1/ingest/scoreboard/",
                    new LinkedHashMap<>(Map.of("sport", sport, "league", league, "date", date)));
        }
    }

    private void postJson(String path, Map<String, String> body) {
        try {
            espnFeedSyncRestClient
                    .post()
                    .uri(path)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            throw new IllegalStateException("Ingest POST failed: " + path + " — " + e.getMessage(), e);
        }
    }
}
