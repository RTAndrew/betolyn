package com.betolyn.features.betting.betslips.bulkvoidodd;

import com.betolyn.features.matches.MatchApiPaths;
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
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class VoidMatch {
    private final VoidMatchUC voidMatchUC;

    @PostMapping("/{matchId}/void")
    public ResponseEntity<ApiResponse<String>> voidMatch(
            @PathVariable String matchId,
            @RequestBody @Valid VoidReasonRequestDTO requestDTO) {
        voidMatchUC.execute(new VoidMatchParam(matchId, requestDTO.getReason()));
        return ResponseEntity.ok(ApiResponse.success("Match voided", null));
    }
}
