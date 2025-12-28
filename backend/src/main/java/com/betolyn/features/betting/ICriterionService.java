package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateCriterionRequestDTO;

import java.util.List;

public interface ICriterionService {
    List<CriterionEntity> findAll();
    CriterionEntity findById(String id);
    CriterionEntity save(CreateCriterionRequestDTO data);
}
