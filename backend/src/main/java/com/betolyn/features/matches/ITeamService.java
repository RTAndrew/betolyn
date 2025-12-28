package com.betolyn.features.matches;


import com.betolyn.features.matches.DTOs.CreateTeamRequestDTO;

import java.util.List;

public interface ITeamService {
    List<TeamEntity> findAll();
    TeamEntity findById(String id);
    TeamEntity createTeam(CreateTeamRequestDTO data);
}
