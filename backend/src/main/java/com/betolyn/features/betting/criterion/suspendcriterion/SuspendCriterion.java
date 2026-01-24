package com.betolyn.features.betting.criterion.suspendcriterion;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA_SUSPEND)
@RequiredArgsConstructor
public class SuspendCriterion {
    private final SuspendCriterionUC suspendCriterionUC;
    private final CriterionMapper criterionMapper;

    @PatchMapping
    public ResponseEntity<ApiResponse<CriterionDTO>> suspend(@PathVariable String criterionId) {
        var criterion = suspendCriterionUC.execute(criterionId);
        return ResponseEntity.ok(ApiResponse.success("Criterion suspended", criterionMapper.toCriterionDTO(criterion)));
    }
}
