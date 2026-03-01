package com.betolyn.features.betting.odds.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OddMetricsDTO {
    private OddDTO odd;
    private Double totalCriterionVolume;
    private Double totalOddVolume;
    private Double marketShare;
    private Double profitAndLosses;
    private Double averageStake;
    private Integer totalBetsCount;
}
