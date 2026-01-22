package com.betolyn.features.betting.criterion.updatecriterionstatus;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA_STATUS)
@RequiredArgsConstructor
public class UpdateCriterionStatus {
    private final UpdateCriterionStatusUC updateCriterionStatusUC;
    private final CriterionMapper criterionMapper;

    @PutMapping
    public ResponseEntity<ApiResponse<CriterionDTO>> updateStatus(
            @PathVariable String criterionId,
            @RequestBody @Valid UpdateCriterionStatusRequestDTO requestDTO) {
        var criterion = updateCriterionStatusUC.execute(new UpdateCriterionStatusParam(criterionId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Criterion status updated", criterionMapper.toCriterionDTO(criterion)));
    }
}
