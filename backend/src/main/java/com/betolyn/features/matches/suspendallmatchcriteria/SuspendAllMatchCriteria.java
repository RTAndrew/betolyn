package com.betolyn.features.matches.suspendallmatchcriteria;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCH_SUSPEND_ALL_CRITERIA)
@RequiredArgsConstructor
public class SuspendAllMatchCriteria {
    private final SuspendAllMatchCriteriaUC suspendAllMatchCriteriaUC;

    @PatchMapping
    public ResponseEntity<ApiResponse<Void>> suspendAllMatchCriteria(@PathVariable String matchId) {
        suspendAllMatchCriteriaUC.execute(matchId);
        return ResponseEntity.ok(ApiResponse.success("All match criteria suspended successfully", null));
    }
}
