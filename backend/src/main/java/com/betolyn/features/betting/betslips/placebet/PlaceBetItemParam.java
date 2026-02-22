package com.betolyn.features.betting.betslips.placebet;

import lombok.Data;

@Data
public class PlaceBetItemParam {
    private String oddId;
    private Double stake;
    private Double oddValueAtPlacement;
}
