package com.betolyn.features.betting.betslips.placebet;

import java.util.ArrayList;
import java.util.List;

import com.betolyn.features.betting.betslips.enums.BetSlipTypeEnum;

import lombok.Data;
import lombok.NonNull;

@Data
public class PlaceBetRequestDTO {
    private BetSlipTypeEnum type;

    @NonNull
    private List<PlaceBetItemParam> items = new ArrayList<>();
}
