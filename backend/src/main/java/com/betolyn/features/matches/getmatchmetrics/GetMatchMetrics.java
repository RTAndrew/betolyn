package com.betolyn.features.matches.getmatchmetrics;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class GetMatchMetrics {
    private final GetMatchMetricsUC getMatchMetricsUC;

    @GetMapping("/{matchId}/metrics")
    public ResponseEntity<ApiResponse<MatchMetricsDTO>> getMetrics(@PathVariable String matchId) {
        MatchMetricsDTO metrics = getMatchMetricsUC.execute(matchId);
        return ResponseEntity.ok(ApiResponse.success("Match metrics", metrics));
    }
}
