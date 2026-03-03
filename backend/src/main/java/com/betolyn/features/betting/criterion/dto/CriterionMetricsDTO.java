package com.betolyn.features.betting.criterion.dto;

import java.math.BigDecimal;

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
    private BigDecimal reservedLiability;
    private BigDecimal maxReservedLiability;
    private Double riskLevel;
    private Integer totalBetsCount;
    private BigDecimal totalStakesVolume;
    /** Realized P/L (after settlement); null when not settled. */
    private BigDecimal profitAndLosses;
}
