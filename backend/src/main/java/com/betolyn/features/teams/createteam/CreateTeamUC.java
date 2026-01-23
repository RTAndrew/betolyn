package com.betolyn.features.teams.createteam;

import com.betolyn.features.IUseCase;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.features.teams.TeamRepository;
import com.betolyn.features.teams.teamSystemEvents.TeamCreatedEventDTO;
import com.betolyn.features.teams.teamSystemEvents.TeamSystemEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateTeamUC implements IUseCase<CreateTeamRequestDTO, TeamEntity> {
    private final TeamRepository teamRepository;
    private final TeamSystemEvent teamSystemEvent;

    @Override
    @Transactional
    public TeamEntity execute(CreateTeamRequestDTO param) {
        TeamEntity team = new TeamEntity();
        team.setName(param.getName());
        team.setBadgeUrl(param.getBadgeUrl());

        var savedTeam = teamRepository.save(team);
        
        var eventDTO = new TeamCreatedEventDTO(savedTeam.getId(), savedTeam);
        teamSystemEvent.publish(this, "teamCreated", eventDTO);

        return savedTeam;
    }
}
