package com.betolyn.features.spaces.findallspaces;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
public class FindAllSpaces {
    private final FindAllSpacesUC findAllSpacesUC;
    private final SpaceMapper spaceMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SpaceDTO>>> findAll() {
        var spaces = findAllSpacesUC.execute().stream().map(spaceMapper::toDTO).toList();
        return ResponseEntity.ok(ApiResponse.success("Spaces found", spaces));
    }
}
