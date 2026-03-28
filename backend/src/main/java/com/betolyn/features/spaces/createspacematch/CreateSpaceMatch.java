package com.betolyn.features.spaces.createspacematch;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchDtoAssembler;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.ROOT)
@RequiredArgsConstructor
public class CreateSpaceMatch {
    private final CreateSpaceMatchUC createSpaceMatchUC;
    private final MatchDtoAssembler matchDtoAssembler;

    @PostMapping("/{spaceId}/matches")
    public ResponseEntity<ApiResponse<MatchDTO>> createSpaceMatch(
            @PathVariable String spaceId,
            @RequestBody CreateSpaceMatchRequestDTO body) {
        MatchEntity entity = createSpaceMatchUC.execute(new CreateSpaceMatchParam(spaceId, body));
        MatchDTO dto = matchDtoAssembler.forSpaceEventResponse(entity);
        return ResponseEntity.ok(ApiResponse.success("Space match created", dto));
    }
}
