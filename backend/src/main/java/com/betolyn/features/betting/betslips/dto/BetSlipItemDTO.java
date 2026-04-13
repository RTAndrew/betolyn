package com.betolyn.features.betting.betslips.dto;

import java.math.BigDecimal;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.matches.MatchDTO;

import lombok.Data;

@Data
public class BetSlipItemDTO {

    private String id;
    private String createdAt;
    private String updatedAt;

    private String matchId;
    private MatchDTO match;
    private String criterionId;
    private String oddId;
    private String lastOddHistoryId;

    private BigDecimal stake;
    private BigDecimal potentialPayout;
    private BigDecimal oddValueAtPlacement;

    private String voidReason;

    private BetSlipItemStatusEnum status;

}
