package com.betolyn.features.betting.criterion.createcriterion;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA)
@RequiredArgsConstructor
public class CreateCriterion {
    private final CreateCriterionUC createCriterionUC;

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<CriterionDTO>> save(@RequestBody CreateCriterionRequestDTO data) {
        var criterion = createCriterionUC.execute(data);
        return ResponseEntity.ok(ApiResponse.success("Criterion created", criterion));
    }
}
