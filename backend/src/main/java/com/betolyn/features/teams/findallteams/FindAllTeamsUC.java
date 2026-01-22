package com.betolyn.features.teams.findallteams;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.features.teams.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindAllTeamsUC implements IUseCaseNoParams<List<TeamEntity>> {
    private final TeamRepository teamRepository;

    @Override
    public List<TeamEntity> execute() {
        return teamRepository.findAll();
    }
}
