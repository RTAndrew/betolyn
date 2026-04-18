package com.betolyn.features.bankroll.transaction.dto;

import java.math.BigDecimal;

import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionItemTypeEnum;

import lombok.Data;

@Data
public class TransactionItemDTO {

    private String id;
    private String createdAt;
    private String updatedAt;

    private String referenceMatchId;
    private String referenceBetSlipId;

    private TransactionItemTypeEnum type;

    private String fromAccountId;
    private AccountTypeEnum fromAccountType;

    private String toAccountId;
    private AccountTypeEnum toAccountType;

    private BigDecimal amount;
}
