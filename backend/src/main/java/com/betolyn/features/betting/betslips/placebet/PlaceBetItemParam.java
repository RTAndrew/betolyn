package com.betolyn.features.betting.betslips.placebet;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlaceBetItemParam {
    private String oddId;
    private BigDecimal stake;
    private BigDecimal oddValueAtPlacement;
}
