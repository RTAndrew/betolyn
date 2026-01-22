package com.betolyn.features.teams.findteambyid;

import com.betolyn.features.teams.TeamApiPaths;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TeamApiPaths.TEAMS)
@RequiredArgsConstructor
public class FindTeamById {
    private final FindTeamByIdUC findTeamByIdUC;

    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamEntity>> findById(@PathVariable String teamId) {
        var team = findTeamByIdUC.execute(teamId);
        return ResponseEntity.ok(ApiResponse.success("Team found", team));
    }
}
