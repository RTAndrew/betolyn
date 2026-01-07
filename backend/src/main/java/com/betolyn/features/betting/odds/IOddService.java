package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.odds.dto.OddDTO;

import java.util.List;

public interface IOddService {
    OddDTO findById(String id);
    List<OddDTO> findAll();
    OddDTO save(CreateOddRequestDTO data);
    List<OddDTO> save(List<OddEntity> odds);
}
