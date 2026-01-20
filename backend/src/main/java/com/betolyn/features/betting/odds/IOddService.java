package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.betting.odds.dto.UpdateOddRequestDTO;

import java.util.List;

public interface IOddService {
    OddEntity findById(String id);
    List<OddDTO> findAll();
    OddDTO save(CreateOddRequestDTO data);
    List<OddEntity> save(List<OddEntity> odds);
    List<OddEntity> update(List<OddEntity> odds);
    OddEntity update(String oddId, UpdateOddRequestDTO odd);
}
