package com.betolyn.features.matches.findmatchbyid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchDtoAssembler;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class FindMatchById {
    private final FindMatchByIdUC findMatchByIdUC;
    private final MatchDtoAssembler matchDtoAssembler;

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<MatchDTO>> findById(@PathVariable String matchId) {
        var match = findMatchByIdUC.execute(matchId);
        var dto = matchDtoAssembler.forMatchDetail(match);
        return ResponseEntity.ok(ApiResponse.success("Match found", dto));
    }
}
