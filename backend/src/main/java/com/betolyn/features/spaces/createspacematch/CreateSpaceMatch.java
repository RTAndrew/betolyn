package com.betolyn.features.spaces.createspacematch;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.features.spaces.SpaceMatchDTO;
import com.betolyn.features.spaces.SpaceMatchEntity;
import com.betolyn.features.spaces.SpaceMatchMapper;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.ROOT)
@RequiredArgsConstructor
public class CreateSpaceMatch {
    private final CreateSpaceMatchUC createSpaceMatchUC;
    private final SpaceMatchMapper spaceMatchMapper;

    @PostMapping("/{spaceId}/matches")
    public ResponseEntity<ApiResponse<SpaceMatchDTO>> createSpaceMatch(
            @PathVariable String spaceId,
            @RequestBody CreateSpaceMatchRequestDTO body) {
        SpaceMatchEntity entity =
                createSpaceMatchUC.execute(new CreateSpaceMatchParam(spaceId, body));
        return ResponseEntity.ok(ApiResponse.success("Space match created", spaceMatchMapper.toDTO(entity)));
    }
}
