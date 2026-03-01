package com.betolyn.features.betting.odds.getoddmetrics;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.features.betting.odds.dto.OddMetricsDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OddApiPaths.ODDS)
@RequiredArgsConstructor
public class GetOddMetrics {
    private final GetOddMetricsUC getOddMetricsUC;

    @GetMapping("/{oddId}/metrics")
    public ResponseEntity<ApiResponse<OddMetricsDTO>> getMetrics(@PathVariable String oddId) {
        OddMetricsDTO metrics = getOddMetricsUC.execute(oddId);
        return ResponseEntity.ok(ApiResponse.success("Odd metrics", metrics));
    }
}