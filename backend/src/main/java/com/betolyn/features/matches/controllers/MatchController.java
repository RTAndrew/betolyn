package com.betolyn.features.matches.controllers;

import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.MatchService;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;
    private final CriterionRepository criterionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDTO>>> findAll() {
        var matches = matchService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Matches found", matches));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<MatchDTO>> findById(@PathVariable String matchId) {
        var match = matchService.findById(matchId);
        return ResponseEntity.ok(ApiResponse.success("Match found", match));
    }

    @GetMapping("/{matchId}/criteria")
    public ResponseEntity<ApiResponse<List<CriterionDTO>>> findMatchCriteriaById(@PathVariable String matchId) {
        var criteria = matchService.findAllCriteriaByMatchId(matchId);

        return ResponseEntity.ok(ApiResponse.success("Criteria for found", criteria));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> createMatch(@RequestBody CreateMatchRequestDTO requestDTO) {
        var match = matchService.createMatch(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Match created", match));
    }
}
