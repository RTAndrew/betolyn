package com.betolyn.features.betting.criterion.getcriterionmetrics;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.dto.CriterionMetricsDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA)
@RequiredArgsConstructor
public class GetCriterionMetrics {
    private final GetCriterionMetricsUC getCriterionMetricsUC;

    @GetMapping("/{criterionId}/metrics")
    public ResponseEntity<ApiResponse<CriterionMetricsDTO>> getMetrics(@PathVariable String criterionId) {
        CriterionMetricsDTO metrics = getCriterionMetricsUC.execute(criterionId);
        return ResponseEntity.ok(ApiResponse.success("Criterion metrics", metrics));
    }
}
