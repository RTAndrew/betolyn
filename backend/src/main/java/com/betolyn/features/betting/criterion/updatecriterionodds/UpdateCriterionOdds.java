package com.betolyn.features.betting.criterion.updatecriterionodds;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA_ODDS)
@RequiredArgsConstructor
public class UpdateCriterionOdds {
    private final BulkUpdateCriteriaOddsUC bulkUpdateCriteriaOddsUC;
    private final CriterionMapper criterionMapper;

    @PatchMapping
    public ResponseEntity<ApiResponse<CriterionDTO>> updateOdds(
            @PathVariable String criterionId,
            @RequestBody UpdateCriterionOddsRequestDTO requestDTO) {
        var criterion = bulkUpdateCriteriaOddsUC.execute(new UpdateCriterionOddsParam(criterionId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Criterion updated", criterionMapper.toCriterionDTO(criterion)));
    }
}
