package com.betolyn.features.matches.controllers;

import com.betolyn.features.matches.dto.CreateTeamRequestDTO;
import com.betolyn.features.matches.TeamEntity;
import com.betolyn.features.matches.TeamService;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamEntity>>> findAll() {
        var teams = teamService.findAll();
        return ResponseEntity.ok(new ApiResponse<List<TeamEntity>>("Teams found", teams));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeamEntity>> createTeam(@RequestBody CreateTeamRequestDTO requestDTO) {
        var team = teamService.createTeam(requestDTO);
        return ResponseEntity.ok(new ApiResponse<>("Team created", team));
    }
}
