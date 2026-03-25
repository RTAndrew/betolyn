package com.betolyn.features.spaces.findspacebyid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
public class FindSpaceById {
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final SpaceMapper spaceMapper;

    @GetMapping("/{spaceId}")
    public ResponseEntity<ApiResponse<SpaceDTO>> findById(@PathVariable String spaceId) {
        var space = findSpaceByIdUC.execute(spaceId);
        return ResponseEntity.ok(ApiResponse.success("Space found", spaceMapper.toDTO(space)));
    }
}
