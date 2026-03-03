package com.betolyn.features.betting.odds.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateOddRequestDTO {
    private OddStatusEnum status;
    private BigDecimal value;
}
