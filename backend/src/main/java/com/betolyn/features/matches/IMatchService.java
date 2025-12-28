package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.CreateMatchRequestDTO;

import java.util.List;

public interface IMatchService {
    List<MatchEntity> findAll();
    MatchEntity findById(String id);
    MatchEntity createMatch(CreateMatchRequestDTO data);
}
