package com.betolyn.features.debug.perf;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * Fetches official matches with plain SQL (no JPA) and assembles the same nested JSON shape as
 * {@code GET /matches}.
 */
@Service
@RequiredArgsConstructor
public class MatchesRawSqlQuery {

    private static final String SQL = """
            SELECT
                m.id AS match_id,
                m.match_type AS match_type,
                m.space_id AS space_id,
                m.official_match_id AS official_match_id,
                m.start_time AS start_time,
                m.end_time AS end_time,
                m.home_team_score AS home_team_score,
                m.away_team_score AS away_team_score,
                m.status AS match_status,
                m.reserved_liability AS reserved_liability,
                m.max_reserved_liability AS max_reserved_liability,
                m.settled_at AS settled_at,
                ht.id AS home_team_id,
                ht.name AS home_team_name,
                ht.espn_id AS home_team_espn_id,
                ht.badge_url AS home_team_badge_url,
                ht.color AS home_team_color,
                ht.short_name AS home_team_short_name,
                ht.alternate_color AS home_team_alternate_color,
                ht.name_abbreviation AS home_team_name_abbreviation,
                ht.is_official AS home_team_is_official,
                ht.created_at AS home_team_created_at,
                ht.updated_at AS home_team_updated_at,
                at.id AS away_team_id,
                at.name AS away_team_name,
                at.espn_id AS away_team_espn_id,
                at.badge_url AS away_team_badge_url,
                at.color AS away_team_color,
                at.short_name AS away_team_short_name,
                at.alternate_color AS away_team_alternate_color,
                at.name_abbreviation AS away_team_name_abbreviation,
                at.is_official AS away_team_is_official,
                at.created_at AS away_team_created_at,
                at.updated_at AS away_team_updated_at,
                c.id AS criterion_id,
                c.name AS criterion_name,
                c.allow_multiple_odds AS criterion_allow_multiple_odds,
                c.allow_multiple_winners AS criterion_allow_multiple_winners,
                c.is_standalone AS criterion_is_standalone,
                c.total_bets_count AS criterion_total_bets_count,
                c.total_stakes_volume AS criterion_total_stakes_volume,
                c.reserved_liability AS criterion_reserved_liability,
                c.max_reserved_liability AS criterion_max_reserved_liability,
                c.status AS criterion_status,
                o.id AS odd_id,
                o.name AS odd_name,
                o.is_winner AS odd_is_winner,
                o.total_bets_count AS odd_total_bets_count,
                o.total_stakes_volume AS odd_total_stakes_volume,
                o.potential_payout_volume AS odd_potential_payout_volume,
                o.value AS odd_value,
                o.status AS odd_status,
                cu.id AS created_by_id,
                cu.email AS created_by_email,
                cu.username AS created_by_username,
                cu.role AS created_by_role,
                uu.id AS updated_by_id,
                uu.email AS updated_by_email,
                uu.username AS updated_by_username,
                uu.role AS updated_by_role
            FROM matches m
            LEFT JOIN teams ht ON ht.id = m.home_team_id
            LEFT JOIN teams at ON at.id = m.away_team_id
            LEFT JOIN criteria c ON c.id = m.criteria_highlight_id
            LEFT JOIN odds o ON o.criterion_id = c.id
            LEFT JOIN users cu ON cu.id = m.created_by
            LEFT JOIN users uu ON uu.id = m.updated_by
            WHERE m.match_type = 'OFFICIAL'
              AND (c.id IS NULL OR c.status IN ('ACTIVE', 'SUSPENDED', 'DRAFT'))
              AND (o.id IS NULL OR o.status IN ('DRAFT', 'SUSPENDED', 'ACTIVE'))
            ORDER BY m.start_time DESC NULLS LAST, m.id, o.name
            """;

    private final JdbcTemplate jdbcTemplate;

    public RawSqlResult fetchAllOfficialMatches() {
        long queryStartedAt = System.nanoTime();
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(SQL);
        long queryMs = elapsedMs(queryStartedAt);

        long assembleStartedAt = System.nanoTime();
        List<Map<String, Object>> matches = assembleMatches(rows);
        long assembleMs = elapsedMs(assembleStartedAt);

        return new RawSqlResult(matches, queryMs, assembleMs);
    }

    private static List<Map<String, Object>> assembleMatches(List<Map<String, Object>> rows) {
        Map<String, Map<String, Object>> matchesById = new LinkedHashMap<>();

        for (Map<String, Object> row : rows) {
            String matchId = stringValue(row.get("match_id"));
            Map<String, Object> match = matchesById.computeIfAbsent(matchId, ignored -> buildMatch(row));

            String oddId = stringValue(row.get("odd_id"));
            if (oddId == null) {
                continue;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> criterion = (Map<String, Object>) match.get("mainCriterion");
            if (criterion == null) {
                continue;
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> odds = (List<Map<String, Object>>) criterion.get("odds");
            if (odds.stream().noneMatch(odd -> oddId.equals(odd.get("id")))) {
                odds.add(buildOdd(row));
            }
        }

        return new ArrayList<>(matchesById.values());
    }

    private static Map<String, Object> buildMatch(Map<String, Object> row) {
        Map<String, Object> match = new LinkedHashMap<>();
        match.put("id", row.get("match_id"));
        match.put("type", stringValue(row.get("match_type")));
        match.put("officialMatchId", row.get("official_match_id"));
        match.put("spaceId", row.get("space_id"));
        match.put("homeTeamScore", intValue(row.get("home_team_score")));
        match.put("awayTeamScore", intValue(row.get("away_team_score")));
        match.put("startTime", row.get("start_time"));
        match.put("endTime", row.get("end_time"));
        match.put("status", stringValue(row.get("match_status")));
        match.put("reservedLiability", moneyValue(row.get("reserved_liability")));
        match.put("maxReservedLiability", moneyValue(row.get("max_reserved_liability")));
        match.put("settledAt", row.get("settled_at"));
        match.put("homeTeam", buildTeam(
                row.get("home_team_id"),
                row.get("home_team_name"),
                row.get("home_team_espn_id"),
                row.get("home_team_badge_url"),
                row.get("home_team_color"),
                row.get("home_team_short_name"),
                row.get("home_team_alternate_color"),
                row.get("home_team_name_abbreviation"),
                row.get("home_team_is_official"),
                row.get("home_team_created_at"),
                row.get("home_team_updated_at")
        ));
        match.put("awayTeam", buildTeam(
                row.get("away_team_id"),
                row.get("away_team_name"),
                row.get("away_team_espn_id"),
                row.get("away_team_badge_url"),
                row.get("away_team_color"),
                row.get("away_team_short_name"),
                row.get("away_team_alternate_color"),
                row.get("away_team_name_abbreviation"),
                row.get("away_team_is_official"),
                row.get("away_team_created_at"),
                row.get("away_team_updated_at")
        ));
        match.put("createdBy", buildUser(
                row.get("created_by_id"),
                row.get("created_by_email"),
                row.get("created_by_username"),
                row.get("created_by_role")
        ));
        match.put("updatedBy", buildUser(
                row.get("updated_by_id"),
                row.get("updated_by_email"),
                row.get("updated_by_username"),
                row.get("updated_by_role")
        ));
        match.put("mainCriterion", buildCriterion(row));
        return match;
    }

    private static Map<String, Object> buildTeam(
            Object id,
            Object name,
            Object espnId,
            Object badgeUrl,
            Object color,
            Object shortName,
            Object alternateColor,
            Object nameAbbreviation,
            Object isOfficial,
            Object createdAt,
            Object updatedAt
    ) {
        if (id == null) {
            return null;
        }

        Map<String, Object> team = new LinkedHashMap<>();
        team.put("id", id);
        team.put("name", name);
        team.put("espnId", espnId);
        team.put("badgeUrl", badgeUrl);
        team.put("color", color);
        team.put("shortName", shortName);
        team.put("alternateColor", alternateColor);
        team.put("nameAbbreviation", nameAbbreviation);
        team.put("isOfficial", booleanValue(isOfficial));
        team.put("createdAt", createdAt);
        team.put("updatedAt", updatedAt);
        return team;
    }

    private static Map<String, Object> buildUser(Object id, Object email, Object username, Object role) {
        if (id == null) {
            return null;
        }

        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id", id);
        user.put("email", email);
        user.put("username", username);
        user.put("role", stringValue(role));
        return user;
    }

    private static Map<String, Object> buildCriterion(Map<String, Object> row) {
        Object criterionId = row.get("criterion_id");
        if (criterionId == null) {
            return null;
        }

        Map<String, Object> criterion = new LinkedHashMap<>();
        criterion.put("id", criterionId);
        criterion.put("name", row.get("criterion_name"));
        criterion.put("allowMultipleOdds", booleanValue(row.get("criterion_allow_multiple_odds")));
        criterion.put("allowMultipleWinners", booleanValue(row.get("criterion_allow_multiple_winners")));
        criterion.put("isStandalone", booleanValue(row.get("criterion_is_standalone")));
        criterion.put("totalBetsCount", intValue(row.get("criterion_total_bets_count")));
        criterion.put("totalStakesVolume", moneyValue(row.get("criterion_total_stakes_volume")));
        criterion.put("reservedLiability", moneyValue(row.get("criterion_reserved_liability")));
        criterion.put("maxReservedLiability", moneyValue(row.get("criterion_max_reserved_liability")));
        criterion.put("status", stringValue(row.get("criterion_status")));
        criterion.put("match", null);
        criterion.put("odds", new ArrayList<Map<String, Object>>());

        String oddId = stringValue(row.get("odd_id"));
        if (oddId != null) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> odds = (List<Map<String, Object>>) criterion.get("odds");
            odds.add(buildOdd(row));
        }

        return criterion;
    }

    private static Map<String, Object> buildOdd(Map<String, Object> row) {
        Map<String, Object> odd = new LinkedHashMap<>();
        odd.put("id", row.get("odd_id"));
        odd.put("matchId", null);
        odd.put("name", row.get("odd_name"));
        odd.put("isWinner", booleanValue(row.get("odd_is_winner")));
        odd.put("totalBetsCount", intValue(row.get("odd_total_bets_count")));
        odd.put("totalStakesVolume", moneyValue(row.get("odd_total_stakes_volume")));
        odd.put("potentialPayoutVolume", moneyValue(row.get("odd_potential_payout_volume")));
        odd.put("value", oddValue(row.get("odd_value")));
        odd.put("status", stringValue(row.get("odd_status")));
        odd.put("lastOddHistory", null);
        return odd;
    }

    private static String stringValue(Object value) {
        return value == null ? null : value.toString();
    }

    private static int intValue(Object value) {
        if (value == null) {
            return 0;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }
        return Integer.parseInt(value.toString());
    }

    private static boolean booleanValue(Object value) {
        if (value == null) {
            return false;
        }
        if (value instanceof Boolean bool) {
            return bool;
        }
        return Boolean.parseBoolean(value.toString());
    }

    private static BigDecimal moneyValue(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal decimal) {
            return decimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return new BigDecimal(value.toString());
    }

    private static BigDecimal oddValue(Object value) {
        BigDecimal decimal = moneyValue(value);
        return decimal == null ? BigDecimal.ZERO : decimal;
    }

    private static long elapsedMs(long startedAtNanos) {
        return (System.nanoTime() - startedAtNanos) / 1_000_000L;
    }

    public record RawSqlResult(List<Map<String, Object>> matches, long queryMs, long assembleMs) {
    }
}
