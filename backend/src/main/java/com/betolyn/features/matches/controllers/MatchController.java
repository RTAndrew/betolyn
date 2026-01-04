package com.betolyn.features.matches.controllers;

import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.MatchEntity;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchEntity>>> findAll() {
        var matches = matchService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Matchers found", matches));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> createMatch(@RequestBody CreateMatchRequestDTO requestDTO) {
        var match = matchService.createMatch(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Match created", match));
    }
}
