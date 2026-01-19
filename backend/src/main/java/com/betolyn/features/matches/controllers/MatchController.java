package com.betolyn.features.matches.controllers;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.MatchService;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.features.matches.dto.UpdateMatchMainCriterionRequestDTO;
import com.betolyn.features.matches.dto.UpdateMatchRequestDTO;
import com.betolyn.features.matches.mapper.MatchMapper;
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
    private final CriterionMapper criterionMapper;
    private final MatchMapper matchMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDTO>>> findAll() {
        var matches = matchService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Matches found", matches));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<MatchDTO>> findById(@PathVariable String matchId) {
        var match = matchService.findById(matchId);

        return ResponseEntity.ok(ApiResponse.success("Match found", matchMapper.toMatchDTO(match)));
    }
    @PatchMapping("/{matchId}")
    public ResponseEntity<ApiResponse<MatchDTO>> updateById(@PathVariable String matchId, @RequestBody UpdateMatchRequestDTO requestDTO) {
        var match = matchService.updateById(matchId, requestDTO);

        return ResponseEntity.ok(ApiResponse.success("Match updated", matchMapper.toMatchDTO(match)));
    }

    @GetMapping("/{matchId}/criteria")
    public ResponseEntity<ApiResponse<List>> findMatchCriteriaById(@PathVariable String matchId) {
        var criteria = matchService.findAllCriteriaByMatchId(matchId);
        var response = criteria.stream().map(criterionMapper::toCriterionDTO).toList();
        return ResponseEntity.ok(ApiResponse.success("Criteria for found", response));
    }



    @PostMapping("/{matchId}/main-criterion")
    public ResponseEntity<ApiResponse<MatchDTO>> updateMainCriterion(@PathVariable String matchId, @RequestBody UpdateMatchMainCriterionRequestDTO data) {
        var match = matchService.updateMainCriterion(matchId, data);
        return ResponseEntity.ok(ApiResponse.success("Criteria for found", matchMapper.toMatchDTO(match)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> createMatch(@RequestBody CreateMatchRequestDTO requestDTO) {
        var match = matchService.createMatch(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Match created", match));
    }

}
