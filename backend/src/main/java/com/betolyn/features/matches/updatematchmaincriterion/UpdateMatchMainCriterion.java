package com.betolyn.features.matches.updatematchmaincriterion;

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
@RequestMapping(MatchApiPaths.MATCH_MAIN_CRITERION)
@RequiredArgsConstructor
public class UpdateMatchMainCriterion {
    private final UpdateMatchMainCriterionUC updateMatchMainCriterionUC;
    private final MatchMapper matchMapper;

    @PutMapping
    public ResponseEntity<ApiResponse<MatchDTO>> updateMainCriterion(
            @PathVariable String matchId,
            @RequestBody @Valid UpdateMatchMainCriterionRequestDTO requestDTO) {
        var match = updateMatchMainCriterionUC
                .execute(new UpdateMatchMainCriterionParam(matchId, requestDTO.criterionId()));
        return ResponseEntity.ok(ApiResponse.success("Main criterion updated", matchMapper.toMatchDTO(match)));
    }
}
