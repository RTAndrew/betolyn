package com.betolyn.features.teams.findallteams;

import com.betolyn.features.teams.TeamApiPaths;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(TeamApiPaths.TEAMS)
@RequiredArgsConstructor
public class FindAllTeams {
    private final FindAllTeamsUC findAllTeamsUC;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamEntity>>> findAll() {
        var teams = findAllTeamsUC.execute();
        return ResponseEntity.ok(ApiResponse.success("Teams found", teams));
    }
}
