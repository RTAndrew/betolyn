package com.betolyn.features.matches.findmatchcriteria;

import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class FindMatchCriteria {
    private final FindMatchCriteriaUC findMatchCriteriaUC;
    private final CriterionMapper criterionMapper;

    @GetMapping("/{matchId}/criteria")
    public ResponseEntity<ApiResponse<List<CriterionDTO>>> findMatchCriteriaById(@PathVariable String matchId) {
        var criteria = findMatchCriteriaUC.execute(matchId);
        var response = criteria.stream().map(criterionMapper::toCriterionDTO).toList();
        return ResponseEntity.ok(ApiResponse.success("Criteria found", response));
    }
}
