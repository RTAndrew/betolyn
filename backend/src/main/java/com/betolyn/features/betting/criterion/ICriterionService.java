package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.criterion.dto.CreateCriterionRequestDTO;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;

import java.util.List;

public interface ICriterionService {
    List<CriterionEntity> findAll();
    CriterionDTO findById(String id);
    CriterionDTO save(CreateCriterionRequestDTO data);
}
