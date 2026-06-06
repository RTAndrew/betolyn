package com.betolyn.features.debug.perf;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchDtoAssembler;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.findallmatches.FindAllMatchesUC;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.features.teams.findallteams.FindAllTeamsUC;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

/**
 * Lightweight perf probes to separate network/app overhead, DB round-trips, entity serialization,
 * and DTO assembly. Compare {@code /debug/perf/matches/query} vs {@code /raw} vs {@code /dto}
 * against production {@code GET /matches}.
 */
@RestController
@RequestMapping(DebugPerfApiPaths.BASE)
@RequiredArgsConstructor
public class PerfDebug {
    private final JdbcTemplate jdbcTemplate;
    private final FindAllTeamsUC findAllTeamsUC;
    private final FindAllMatchesUC findAllMatchesUC;
    private final MatchDtoAssembler matchDtoAssembler;
    private final MatchesRawSqlQuery matchesRawSqlQuery;

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<PerfPayload<String>>> ping() {
        long startedAt = System.nanoTime();
        var payload = new PerfPayload<>("pong", PerfMeta.of(elapsedMs(startedAt)));
        return ResponseEntity.ok(ApiResponse.success("Pong", payload));
    }

    @GetMapping("/db-ping")
    public ResponseEntity<ApiResponse<PerfPayload<Integer>>> dbPing() {
        long startedAt = System.nanoTime();
        long queryStartedAt = System.nanoTime();
        Integer value = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        long queryMs = elapsedMs(queryStartedAt);
        var payload = new PerfPayload<>(value, new PerfMeta(elapsedMs(startedAt), queryMs, null, null));
        return ResponseEntity.ok(ApiResponse.success("DB ping ok", payload));
    }

    @GetMapping("/teams/query")
    public ResponseEntity<ApiResponse<PerfPayload<Map<String, Integer>>>> teamsQueryOnly() {
        long startedAt = System.nanoTime();
        long queryStartedAt = System.nanoTime();
        int count = findAllTeamsUC.execute().size();
        long queryMs = elapsedMs(queryStartedAt);
        var payload = new PerfPayload<>(
                Map.of("count", count),
                PerfMeta.withPhases(elapsedMs(startedAt), queryMs, null, count)
        );
        return ResponseEntity.ok(ApiResponse.success("Teams query only", payload));
    }

    @GetMapping("/teams/raw")
    public ResponseEntity<ApiResponse<PerfPayload<List<TeamEntity>>>> teamsRaw() {
        long startedAt = System.nanoTime();
        long queryStartedAt = System.nanoTime();
        List<TeamEntity> teams = findAllTeamsUC.execute();
        long queryMs = elapsedMs(queryStartedAt);
        var payload = new PerfPayload<>(teams, PerfMeta.withPhases(elapsedMs(startedAt), queryMs, null, teams.size()));
        return ResponseEntity.ok(ApiResponse.success("Teams raw entities", payload));
    }

    @GetMapping("/matches/query")
    public ResponseEntity<ApiResponse<PerfPayload<Map<String, Integer>>>> matchesQueryOnly() {
        long startedAt = System.nanoTime();
        long queryStartedAt = System.nanoTime();
        int count = findAllMatchesUC.execute().size();
        long queryMs = elapsedMs(queryStartedAt);
        var payload = new PerfPayload<>(
                Map.of("count", count),
                PerfMeta.withPhases(elapsedMs(startedAt), queryMs, null, count)
        );
        return ResponseEntity.ok(ApiResponse.success("Matches query only", payload));
    }

    @GetMapping("/matches/raw")
    public ResponseEntity<ApiResponse<PerfPayload<List<MatchEntity>>>> matchesRaw() {
        long startedAt = System.nanoTime();
        long queryStartedAt = System.nanoTime();
        List<MatchEntity> matches = findAllMatchesUC.execute();
        long queryMs = elapsedMs(queryStartedAt);
        var payload = new PerfPayload<>(
                matches,
                PerfMeta.withPhases(elapsedMs(startedAt), queryMs, null, matches.size())
        );
        return ResponseEntity.ok(ApiResponse.success("Matches raw entities", payload));
    }

    @GetMapping("/matches/dto")
    public ResponseEntity<ApiResponse<PerfPayload<List<MatchDTO>>>> matchesDto() {
        long startedAt = System.nanoTime();
        long queryStartedAt = System.nanoTime();
        List<MatchEntity> matches = findAllMatchesUC.execute();
        long queryMs = elapsedMs(queryStartedAt);

        long mapStartedAt = System.nanoTime();
        List<MatchDTO> dtos = matches.stream().map(matchDtoAssembler::forMatchDetail).toList();
        long mapMs = elapsedMs(mapStartedAt);

        var payload = new PerfPayload<>(
                dtos,
                PerfMeta.withPhases(elapsedMs(startedAt), queryMs, mapMs, dtos.size())
        );
        return ResponseEntity.ok(ApiResponse.success("Matches full DTO pipeline", payload));
    }

    /**
     * Same nested JSON as {@code GET /matches}, but fetched with one plain SQL query via
     * {@link JdbcTemplate} (no JPA entities or DTO mappers).
     */
    @GetMapping("/matches/sql")
    public ResponseEntity<ApiResponse<PerfPayload<List<Map<String, Object>>>>> matchesSql() {
        long startedAt = System.nanoTime();
        MatchesRawSqlQuery.RawSqlResult result = matchesRawSqlQuery.fetchAllOfficialMatches();
        var payload = new PerfPayload<>(
                result.matches(),
                PerfMeta.withPhases(
                        elapsedMs(startedAt),
                        result.queryMs(),
                        result.assembleMs(),
                        result.matches().size()
                )
        );
        return ResponseEntity.ok(ApiResponse.success("Matches found via raw SQL", payload));
    }

    private static long elapsedMs(long startedAtNanos) {
        return (System.nanoTime() - startedAtNanos) / 1_000_000L;
    }
}
