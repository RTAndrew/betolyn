package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateCriterionRequestDTO;
import com.betolyn.features.betting.dtos.CriterionDTO;

import java.util.List;

public interface ICriterionService {
    List<CriterionEntity> findAll();
    CriterionDTO findById(String id);
    CriterionDTO save(CreateCriterionRequestDTO data);
}
