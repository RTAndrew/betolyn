package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.dto.MatchDTO;

import java.util.List;

public interface IMatchService {
    List<MatchDTO> findAll();
    MatchDTO findById(String id);
    MatchDTO createMatch(CreateMatchRequestDTO data);
}
