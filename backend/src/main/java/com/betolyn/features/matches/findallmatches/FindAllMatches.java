package com.betolyn.features.matches.findallmatches;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class FindAllMatches {
    private final FindAllMatchesUC findAllMatchesUC;
    private final MatchMapper matchMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDTO>>> findAll() {
        var matches = findAllMatchesUC.execute()
                .stream()
                .map(matchMapper::toMatchDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Matches found", matches));
    }
}
