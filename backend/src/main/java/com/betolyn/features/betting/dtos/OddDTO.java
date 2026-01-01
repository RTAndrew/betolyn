package com.betolyn.features.betting.dtos;

import lombok.Data;

@Data
public class OddDTO {
    private String name;
    private double value;
    private double minimumAmount;
    private double maximumAmount;
    private CriterionDTO criterion;
}
