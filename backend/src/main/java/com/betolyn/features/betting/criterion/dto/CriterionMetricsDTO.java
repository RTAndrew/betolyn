package com.betolyn.features.betting.criterion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CriterionMetricsDTO {
    private String criterionName;
    private Double reservedLiability;
    private Double maxReservedLiability;
    private Double riskLevel;
    private Double totalBetsCount;
    private Double totalStakesVolume;
    private CriterionProfitAndLossDTO profitAndLosses;
}
