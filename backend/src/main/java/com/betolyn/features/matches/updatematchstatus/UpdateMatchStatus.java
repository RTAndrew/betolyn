package com.betolyn.features.matches.updatematchstatus;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class UpdateMatchStatus {
    private final UpdateMatchStatusUC updateMatchStatusUC;
    private final MatchMapper matchMapper;

    @PutMapping(MatchApiPaths.MATCH_STATUS)
    public ResponseEntity<ApiResponse<MatchDTO>> updateMatchStatus(
            @PathVariable String matchId,
            @RequestBody @Valid UpdateMatchStatusRequestDTO requestDTO) {
        var match = updateMatchStatusUC.execute(new UpdateMatchStatusParam(matchId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Match status updated", matchMapper.toMatchDTO(match)));
    }
}
