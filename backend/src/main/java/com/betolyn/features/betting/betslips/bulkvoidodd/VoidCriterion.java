package com.betolyn.features.betting.betslips.bulkvoidodd;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA)
@RequiredArgsConstructor
public class VoidCriterion {
    private final VoidCriterionUC voidCriterionUC;

    @PostMapping("/{criterionId}/void")
    public ResponseEntity<ApiResponse<String>> voidCriterion(
            @PathVariable String criterionId,
            @RequestBody @Valid VoidReasonRequestDTO requestDTO) {
        voidCriterionUC.execute(new VoidCriterionParam(criterionId, requestDTO.getReason()));
        return ResponseEntity.ok(ApiResponse.success("Criterion voided", null));
    }
}
