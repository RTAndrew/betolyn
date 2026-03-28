package com.betolyn.features.spaces.findspacematches;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchDtoAssembler;
import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.ROOT)
@RequiredArgsConstructor
public class FindSpaceMatches {
    private final FindSpaceMatchesUC findSpaceMatchesUC;
    private final MatchDtoAssembler matchDtoAssembler;

    @GetMapping("/{spaceId}/matches")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> findBySpaceId(@PathVariable String spaceId) {
        var matches = findSpaceMatchesUC.execute(spaceId).stream()
                .map(matchDtoAssembler::forSpaceEventResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Space matches found", matches));
    }
}
