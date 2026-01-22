package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.UpdateMatchMainCriterionRequestDTO;
import com.betolyn.features.matches.dto.UpdateMatchRequestDTO;

import java.util.List;

public interface IMatchService {
    List<MatchDTO> findAll();
    MatchEntity findById(String id);
    MatchEntity updateById(String id, UpdateMatchRequestDTO requestDTO);
    MatchEntity updateMainCriterion(String matchId, UpdateMatchMainCriterionRequestDTO data);
}
