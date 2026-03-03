package com.betolyn.features.matches.getmatchmetrics;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchMetricsDTO {
    private BigDecimal totalVolume;
    private BigDecimal reservedLiability;
    private BigDecimal maxReservedLiability;
    /** Risk level 0–100 from reservedLiability / maxReservedLiability; 0 when max is null or 0. */
    private Double riskLevel;
    private Integer totalCriteriaCount;
    private Integer totalBetCount;
    /** Realized P/L (after settlement); null when no settled criteria. */
    private BigDecimal profitAndLosses;
}
