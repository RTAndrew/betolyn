package com.betolyn.features.betting.criterion.findcriterionbyid;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
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
public class FindCriterionById {
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionMapper criterionMapper;

    @GetMapping("/{criterionId}")
    public ResponseEntity<ApiResponse<CriterionDTO>> findById(@PathVariable String criterionId) {
        var criterion = findCriterionByIdUC.execute(criterionId);
        return ResponseEntity.ok(ApiResponse.success("Criterion found", criterionMapper.toCriterionDTO(criterion)));
    }
}
