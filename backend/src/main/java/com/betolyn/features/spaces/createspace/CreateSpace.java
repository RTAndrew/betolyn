package com.betolyn.features.spaces.createspace;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.features.spaces.SpaceDTO;
import com.betolyn.features.spaces.SpaceMapper;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.ROOT)
@RequiredArgsConstructor
public class CreateSpace {
    private final CreateSpaceUC createSpaceUC;
    private final SpaceMapper spaceMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<SpaceDTO>> createSpace(@RequestBody CreateSpaceRequestDTO param) {
        var space = createSpaceUC.execute(param);
        return ResponseEntity.ok(ApiResponse.success("Space created", spaceMapper.toDTO(space)));
    }
}
