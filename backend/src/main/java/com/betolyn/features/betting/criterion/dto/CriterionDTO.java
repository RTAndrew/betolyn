package com.betolyn.features.betting.criterion.dto;

import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.matches.dto.MatchDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
public class CriterionDTO {
    private String id;
    private String name;
    private boolean allowMultipleOdds;
    private boolean isStandalone;

    private MatchDTO match;
    @JsonIgnoreProperties("criterion")
    private List<OddDTO> odds;
}
