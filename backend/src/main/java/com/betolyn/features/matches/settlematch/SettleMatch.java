package com.betolyn.features.matches.settlematch;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class SettleMatch {
    private final SettleMatchUC settleMatchUC;

    @PostMapping("/{matchId}/settle")
    public ResponseEntity<ApiResponse<String>> settle(@PathVariable String matchId) {
        settleMatchUC.execute(matchId);
        return ResponseEntity.ok(ApiResponse.success("Match settled", null));
    }
}
