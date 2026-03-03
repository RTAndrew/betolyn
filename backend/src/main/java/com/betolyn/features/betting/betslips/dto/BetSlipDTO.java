package com.betolyn.features.betting.betslips.dto;

import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipTypeEnum;
import com.betolyn.features.user.UserDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class BetSlipDTO {

    private BigDecimal totalCumulativeOdds;

    private Double totalItemsCount;

    private BigDecimal totalStake;

    private BigDecimal totalPotentialPayout;

    private BetSlipTypeEnum type = BetSlipTypeEnum.SINGLE;

    private String voidReason;

    private BetSlipStatusEnum status;

    private UserDTO createdBy;

    private List<BetSlipItemDTO> items;
}
