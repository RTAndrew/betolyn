package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.features.matches.dto.UpdateMatchMainCriterionRequestDTO;
import com.betolyn.features.matches.dto.UpdateMatchRequestDTO;

import java.util.List;

public interface IMatchService {
    List<MatchDTO> findAll();
    MatchEntity findById(String id);
    MatchEntity updateById(String id, UpdateMatchRequestDTO requestDTO);
    MatchDTO createMatch(CreateMatchRequestDTO data);
    MatchEntity updateMainCriterion(String matchId, UpdateMatchMainCriterionRequestDTO data);
}
