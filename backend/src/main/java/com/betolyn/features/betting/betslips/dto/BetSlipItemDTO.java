package com.betolyn.features.betting.betslips.dto;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BetSlipItemDTO {

    private String id;

    private String matchId;
    private String criterionId;
    private String oddId;
    private String lastOddHistoryId;

    private BigDecimal stake;
    private BigDecimal potentialPayout;
    private BigDecimal oddValueAtPlacement;

    private String voidReason;

    private BetSlipItemStatusEnum status;

}
