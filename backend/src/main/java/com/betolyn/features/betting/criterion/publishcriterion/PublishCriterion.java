package com.betolyn.features.betting.criterion.publishcriterion;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA_PUBLISH)
@RequiredArgsConstructor
public class PublishCriterion {
    private final PublishCriterionUC publishCriterionUC;
    private final CriterionMapper criterionMapper;

    @PatchMapping
    public ResponseEntity<ApiResponse<CriterionDTO>> publish(@PathVariable String criterionId) {
        var criterion = publishCriterionUC.execute(criterionId);
        return ResponseEntity.ok(ApiResponse.success("Criterion published", criterionMapper.toCriterionDTO(criterion)));
    }
}
