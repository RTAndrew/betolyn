package com.betolyn.features.matches.findmatchbyid;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class FindMatchById {
    private final FindMatchByIdUC findMatchByIdUC;
    private final MatchMapper matchMapper;

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<MatchDTO>> findById(@PathVariable String matchId) {
        var match = findMatchByIdUC.execute(matchId);
        return ResponseEntity.ok(ApiResponse.success("Match found", matchMapper.toMatchDTO(match)));
    }
}
