package com.betolyn.features.matches.suspendallmatchcriteria;

import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.suspendcriterion.SuspendBulkCriterionUC;
import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class SuspendAllMatchCriteria {
    private final FindMatchByIdUC findMatchByIdUC;
    private final SuspendBulkCriterionUC suspendBulkCriterionUC;
    private final CriterionMapper criterionMapper;

    @PostMapping("/{matchId}/criteria/suspend-all")
    public ResponseEntity<ApiResponse<List<CriterionDTO>>> suspendAll(@PathVariable String matchId)
            throws MatchNotFoundException {
        findMatchByIdUC.execute(matchId);
        var criteria = suspendBulkCriterionUC.execute(matchId);
        var response = criteria.stream().map(criterionMapper::toCriterionDTO).toList();
        return ResponseEntity.ok(ApiResponse.success("Criteria suspended", response));
    }
}
