package com.betolyn.features.teams.createteam;

import com.betolyn.features.teams.TeamApiPaths;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TeamApiPaths.TEAMS)
@RequiredArgsConstructor
public class CreateTeam {
    private final CreateTeamUC createTeamUC;

    @PostMapping
    public ResponseEntity<ApiResponse<TeamEntity>> createTeam(@RequestBody CreateTeamRequestDTO param) {
        TeamEntity entity = createTeamUC.execute(param);
        return ResponseEntity.ok(ApiResponse.success("Team created", entity));
    }
}
