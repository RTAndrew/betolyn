package com.betolyn.features.betting.betslips.placebet;

import com.betolyn.features.betting.betslips.enums.BetSlipTypeEnum;
import lombok.Data;
import lombok.NonNull;
import org.jspecify.annotations.Nullable;

import java.util.List;

@Data
public class PlaceBetRequestDTO {
    private BetSlipTypeEnum type;

    @NonNull
    private List<PlaceBetItemParam> items;
}
