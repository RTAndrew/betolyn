package com.betolyn.features.matches;

import com.betolyn.features.matches.DTOs.CreateMatchRequestDTO;

import java.util.List;

public interface IMatchService {
    List<MatchEntity> findAll();
    MatchEntity createMatch(CreateMatchRequestDTO data);
}
