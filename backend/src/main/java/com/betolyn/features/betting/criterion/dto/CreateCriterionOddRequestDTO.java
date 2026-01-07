package com.betolyn.features.betting.criterion.dto;

import lombok.Data;

@Data
public class CreateCriterionOddRequestDTO {
    private String name;
    private double value;
    private double minimumAmount = 0.1;
    private double maximumAmount = 999;
}
