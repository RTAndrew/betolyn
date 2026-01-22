package com.betolyn.features.teams.createteam;

import com.betolyn.features.IUseCase;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.features.teams.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateTeamUC implements IUseCase<CreateTeamRequestDTO, TeamEntity> {
    private final TeamRepository teamRepository;

    @Override
    public TeamEntity execute(CreateTeamRequestDTO param) {
        TeamEntity team = new TeamEntity();
        team.setName(param.getName());
        team.setBadgeUrl(param.getBadgeUrl());

        return teamRepository.save(team);
    }
}
