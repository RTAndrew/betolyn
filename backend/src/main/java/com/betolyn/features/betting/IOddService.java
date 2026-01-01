package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateOddRequestDTO;
import com.betolyn.features.betting.dtos.OddDTO;

import java.util.List;

public interface IOddService {
    OddDTO findById(String id);
    List<OddEntity> findAll();
    OddDTO save(CreateOddRequestDTO data);
}
