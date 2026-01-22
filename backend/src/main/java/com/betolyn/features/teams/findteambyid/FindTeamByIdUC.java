package com.betolyn.features.teams.findteambyid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.features.teams.TeamNotFoundException;
import com.betolyn.features.teams.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindTeamByIdUC implements IUseCase<String, TeamEntity> {
    private final TeamRepository teamRepository;

    @Override
    public TeamEntity execute(String teamId) throws TeamNotFoundException {
        return teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
    }
}
