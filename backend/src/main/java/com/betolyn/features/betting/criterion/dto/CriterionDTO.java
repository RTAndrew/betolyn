package com.betolyn.features.betting.criterion.dto;

import com.betolyn.features.matches.dto.MatchDTO;
import lombok.Data;

@Data
public class CriterionDTO {
    private String id;
    private boolean allowMultipleOdds;
    private boolean isStandalone;

    private MatchDTO match;
}
