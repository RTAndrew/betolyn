package com.betolyn.features.matches.reschedulematch;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCH_RESCHEDULE)
@RequiredArgsConstructor
public class RescheduleMatch {
    private final RescheduleMatchUC rescheduleMatchUC;
    private final MatchMapper matchMapper;

    @PatchMapping
    public ResponseEntity<ApiResponse<MatchDTO>> rescheduleMatch(
            @PathVariable String matchId,
            @RequestBody @Valid RescheduleMatchRequestDTO requestDTO) {

        var match = rescheduleMatchUC.execute(new RescheduleMatchParam(matchId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Match rescheduled", matchMapper.toMatchDTO(match)));
    }
}
