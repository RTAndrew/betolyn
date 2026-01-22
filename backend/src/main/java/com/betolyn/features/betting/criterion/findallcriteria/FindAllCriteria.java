package com.betolyn.features.betting.criterion.findallcriteria;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA)
@RequiredArgsConstructor
public class FindAllCriteria {
    private final FindAllCriteriaUC findAllCriteriaUC;
    private final CriterionMapper criterionMapper;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<CriterionDTO>>> findAll() {
        var criteria = findAllCriteriaUC.execute()
                .stream()
                .map(criterionMapper::toCriterionDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Criteria found", criteria));
    }
}
