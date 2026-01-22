package com.betolyn.features.matches.updatematchscore;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCH_SCORE)
@RequiredArgsConstructor
public class UpdateMatchScore {
    private final MatchMapper matchMapper;
    private final UpdateMatchScoreUC updateMatchScoreUC;

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> updateMatchScore(
            @PathVariable String matchId,
            @RequestBody UpdateMatchScoreRequestDTO requestDTO) {

        var match = updateMatchScoreUC.execute(new UpdateMatchScoreParam(matchId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Match score updated", matchMapper.toMatchDTO(match)));
    }
}
