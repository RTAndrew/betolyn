package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateOddRequestDTO;

import java.util.List;

public interface IOddService {
    OddEntity findById(String id);
    List<OddEntity> findAll();
    OddEntity save(CreateOddRequestDTO data);
}
