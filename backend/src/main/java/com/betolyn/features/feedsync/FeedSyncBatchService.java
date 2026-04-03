package com.betolyn.features.feedsync;

import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.features.teams.TeamRepository;
import tools.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedSyncBatchService {

    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final IngestionStateRepository ingestionStateRepository;
    private final FeedIngestTriggerService feedIngestTriggerService;

    @Transactional
    public void applyTeamBatch(JsonNode results, IngestionStateEntity state) {
        if (results == null || !results.isArray() || results.isEmpty()) {
            return;
        }
        Instant maxT = state.getWatermarkUpdatedAt();
        Long maxId = state.getWatermarkRowId();

        for (JsonNode row : results) {
            String espnId = text(row, "espn_id");
            if (espnId == null || espnId.isEmpty()) {
                continue;
            }
            TeamEntity t = teamRepository.findByEspnId(espnId).orElseGet(TeamEntity::new);
            if (t.getId() == null) {
                t.generateId();
            }
            String display = text(row, "display_name");
            t.setName(display != null && !display.isEmpty() ? display : "Team");
            t.setEspnId(espnId);
            t.setColor(text(row, "color"));
            t.setAlternateColor(text(row, "alternate_color"));
            String abbr = text(row, "abbreviation");
            if (abbr == null) {
                abbr = text(row, "short_display_name");
            }
            t.setNameAbbreviation(abbr);
            t.setShortName(text(row, "short_display_name"));
            String badge = text(row, "logo");
            if (badge == null && row.has("logos")) {
                badge = pickPrimaryLogoHref(row.get("logos"));
            }
            t.setBadgeUrl(badge);
            t.setIsOfficial(true);
            teamRepository.save(t);

            Cursor c = parseCursor(row);
            if (c != null && (maxT == null || cursorAfter(c, maxT, maxId))) {
                maxT = c.instant();
                maxId = c.id();
            }
        }

        if (maxT != null && maxId != null) {
            state.setWatermarkUpdatedAt(maxT);
            state.setWatermarkRowId(maxId);
            state.setLastError(null);
            state.setRowUpdatedAt(Instant.now());
            ingestionStateRepository.save(state);
        }
    }

    @Transactional
    public void applyEventBatch(JsonNode results, IngestionStateEntity state) {
        if (results == null || !results.isArray() || results.isEmpty()) {
            return;
        }
        Instant maxT = state.getWatermarkUpdatedAt();
        Long maxId = state.getWatermarkRowId();

        for (JsonNode row : results) {
            String espnEventId = text(row, "espn_id");
            if (espnEventId == null || espnEventId.isEmpty()) {
                continue;
            }
            String homeTid = text(row, "home_team_espn_id");
            String awayTid = text(row, "away_team_espn_id");
            if (homeTid == null || awayTid == null) {
                log.warn("feed_sync_skip_event_missing_side_teams espnEventId={}", espnEventId);
                continue;
            }
            TeamEntity home = teamRepository.findByEspnId(homeTid).orElse(null);
            TeamEntity away = teamRepository.findByEspnId(awayTid).orElse(null);
            if (home == null || away == null) {
                String sport = text(row, "sport_slug");
                String league = text(row, "league_slug");
                feedIngestTriggerService.enqueueIfAbsent(sport, league);
                log.warn(
                        "feed_sync_skip_event_teams_not_found_queued_league espnEventId={} home={} away={} sport={} league={}",
                        espnEventId,
                        homeTid,
                        awayTid,
                        sport,
                        league);
                continue;
            }

            MatchEntity m = matchRepository.findByEspnId(espnEventId).orElseGet(MatchEntity::new);
            if (m.getId() == null) {
                m.generateId();
            }
            m.setEspnId(espnEventId);
            m.setType(MatchTypeEnum.OFFICIAL);
            m.setHomeTeam(home);
            m.setAwayTeam(away);
            m.setVenueName(text(row, "venue_name"));
            m.setStartTime(text(row, "date"));
            m.setStatus(mapStatus(text(row, "status")));
            Integer hs = intField(row, "home_team_score");
            Integer as = intField(row, "away_team_score");
            if (hs != null) {
                m.setHomeTeamScore(hs);
            }
            if (as != null) {
                m.setAwayTeamScore(as);
            }
            matchRepository.save(m);

            Cursor c = parseCursor(row);
            if (c != null && (maxT == null || cursorAfter(c, maxT, maxId))) {
                maxT = c.instant();
                maxId = c.id();
            }
        }

        if (maxT != null && maxId != null) {
            state.setWatermarkUpdatedAt(maxT);
            state.setWatermarkRowId(maxId);
            state.setLastError(null);
            state.setRowUpdatedAt(Instant.now());
            ingestionStateRepository.save(state);
        }
    }

    private static boolean cursorAfter(Cursor c, Instant t, Long id) {
        int cmp = c.instant().compareTo(t);
        if (cmp > 0) {
            return true;
        }
        if (cmp < 0) {
            return false;
        }
        return id == null || c.id() > id;
    }

    private record Cursor(Instant instant, long id) {}

    private static Cursor parseCursor(JsonNode row) {
        if (!row.hasNonNull("updated_at") || !row.hasNonNull("id")) {
            return null;
        }
        try {
            return new Cursor(Instant.parse(row.get("updated_at").asText()), row.get("id").asLong());
        } catch (Exception e) {
            return null;
        }
    }

    private static String text(JsonNode row, String field) {
        if (row == null || !row.has(field) || row.get(field).isNull()) {
            return null;
        }
        String s = row.get(field).asText();
        return s.isEmpty() ? null : s;
    }

    /** Parse integer score from sync JSON (number or numeric string). */
    private static Integer intField(JsonNode row, String field) {
        if (row == null || !row.has(field) || row.get(field).isNull()) {
            return null;
        }
        JsonNode n = row.get(field);
        if (n.isInt() || n.isLong()) {
            return n.asInt();
        }
        if (n.isTextual()) {
            String s = n.asText().trim();
            if (s.isEmpty()) {
                return null;
            }
            try {
                return Integer.parseInt(s);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    /** Match ingestion service: prefer logo with {@code default} in {@code rel}, else first {@code href}/{@code url}. */
    private static String pickPrimaryLogoHref(JsonNode logos) {
        if (logos == null || !logos.isArray() || logos.isEmpty()) {
            return null;
        }

        for (JsonNode logo : logos) {
            if (logo == null || !logo.isObject()) {
                continue;
            }
            if (!relContainsDefault(logo.get("rel"))) {
                continue;
            }
            String h = logoHref(logo);
            if (h != null) {
                return h;
            }
        }

        for (JsonNode logo : logos) {
            if (logo == null || !logo.isObject()) {
                continue;
            }
            String h = logoHref(logo);
            if (h != null) {
                return h;
            }
        }
        return null;
    }

    private static boolean relContainsDefault(JsonNode rel) {
        if (rel == null || rel.isNull()) {
            return false;
        }
        if (rel.isTextual()) {
            return "default".equalsIgnoreCase(rel.asText());
        }
        if (rel.isArray()) {
            for (JsonNode r : rel) {
                if (r != null && r.isTextual() && "default".equalsIgnoreCase(r.asText())) {
                    return true;
                }
            }
        }
        return false;
    }

    private static String logoHref(JsonNode logo) {
        String h = text(logo, "href");
        if (h != null) {
            return h;
        }
        return text(logo, "url");
    }

    private static MatchStatusEnum mapStatus(String raw) {
        if (raw == null) {
            return MatchStatusEnum.SCHEDULED;
        }
        return switch (raw.toLowerCase(Locale.ROOT)) {
            case "in_progress" -> MatchStatusEnum.LIVE;
            case "final" -> MatchStatusEnum.ENDED;
            case "cancelled", "postponed" -> MatchStatusEnum.CANCELLED;
            default -> MatchStatusEnum.SCHEDULED;
        };
    }
}
