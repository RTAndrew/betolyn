package com.betolyn.features.betting.betslips.dto;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import lombok.Data;

@Data
public class BetSlipItemDTO {

    private String id;

    private String matchId;
    private String criterionId;
    private String oddId;
    private String lastOddHistoryId;

    private Double stake;
    private Double potentialPayout;
    private Double oddValueAtPlacement;

    private String voidReason;

    private BetSlipItemStatusEnum status;

}
