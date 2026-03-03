package com.betolyn.features.betting.odds.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OddMetricsDTO {
    private OddDTO odd;
    private BigDecimal totalCriterionVolume;
    private BigDecimal totalOddVolume;
    private Double marketShare;
    private BigDecimal profitAndLosses;
    private BigDecimal averageStake;
    private Integer totalBetsCount;
}
