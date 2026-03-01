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
    /** Realized P/L (after settlement); null when not settled. */
    private Double profitAndLosses;
}
