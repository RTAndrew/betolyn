package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.CreateTeamRequestDTO;
import com.betolyn.utils.GenerateId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService implements ITeamService {
    private final TeamRepository teamRepository;

    @Override
    public List<TeamEntity> findAll() {
        return teamRepository.findAll();
    }

    @Override
    public TeamEntity findById(String id) {
        return teamRepository.findById(id).orElseThrow();
    }

    @Override
    public TeamEntity createTeam(CreateTeamRequestDTO requestDTO) {
        TeamEntity team = new TeamEntity();
        team.setId(new GenerateId(12, "team").generate());
        team.setName(requestDTO.getName());

        return teamRepository.save(team);
    }
}
