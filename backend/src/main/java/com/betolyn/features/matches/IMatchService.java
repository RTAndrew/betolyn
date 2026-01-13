package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.features.matches.dto.UpdateMatchMainCriterionRequestDTO;

import java.util.List;

public interface IMatchService {
    List<MatchDTO> findAll();
    MatchEntity findById(String id);
    MatchDTO createMatch(CreateMatchRequestDTO data);
    MatchEntity updateMainCriterion(String matchId, UpdateMatchMainCriterionRequestDTO data);
}
