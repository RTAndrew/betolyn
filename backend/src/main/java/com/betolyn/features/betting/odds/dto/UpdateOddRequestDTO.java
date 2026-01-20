package com.betolyn.features.betting.odds.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;
import lombok.Data;

@Data
public class UpdateOddRequestDTO {
    private OddStatusEnum status;
    private Double value;
}
