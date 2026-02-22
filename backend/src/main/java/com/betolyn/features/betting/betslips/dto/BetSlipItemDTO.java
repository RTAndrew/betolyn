package com.betolyn.features.betting.betslips.dto;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class BetSlipItemDTO {
    private String matchId;
    private String criterionId;
    private String lastOddHistoryId;

    private Double stake;
    private Double potentialPayout;
    private Double oddValueAtPlacement;

    private String voidReason;

    private BetSlipItemStatusEnum status;

}
