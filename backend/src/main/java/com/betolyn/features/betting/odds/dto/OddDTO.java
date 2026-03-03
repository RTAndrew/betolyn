package com.betolyn.features.betting.odds.dto;

import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OddDTO {
    private String id;
    private String matchId;

    private String name;
    private BigDecimal value;
    private Boolean isWinner = false;

    private Integer totalBetsCount = 0;
    private BigDecimal totalStakesVolume;
    private BigDecimal potentialPayoutVolume;

    @JsonIgnoreProperties({"match", "odds"}) // avoid self reference
    private CriterionDTO criterion;
    private OddStatusEnum status;

    @JsonIgnoreProperties("odd") // avoid self reference lastOdd <-> odd
    private OddHistoryDTO lastOddHistory;
}
