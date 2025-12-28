package com.betolyn.features.matches;


import com.betolyn.features.matches.dto.CreateTeamRequestDTO;

import java.util.List;

public interface ITeamService {
    List<TeamEntity> findAll();
    TeamEntity findById(String id);
    TeamEntity createTeam(CreateTeamRequestDTO data);
}
