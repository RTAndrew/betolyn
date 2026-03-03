package com.betolyn.features.betting.criterion.dto;

import java.math.BigDecimal;
import java.util.List;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.matches.MatchDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
public class CriterionDTO {
    private String id;
    private String name;
    private boolean allowMultipleOdds;
    private boolean allowMultipleWinners;
    private boolean isStandalone;

    private Integer totalBetsCount;
    private BigDecimal totalStakesVolume;
    private BigDecimal reservedLiability;
    private BigDecimal maxReservedLiability;

    private MatchDTO match;
    private CriterionStatusEnum status;

    @JsonIgnoreProperties("criterion")
    private List<OddDTO> odds;
}
