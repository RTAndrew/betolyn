package com.betolyn.features.betting.betslips.bulkvoidodd;

import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;

import java.util.List;

public record BulkVoidOddParam(
        String referenceId,
        TransactionReferenceTypeEnum referenceType,
        TransactionTypeEnum voidType,
        String reason,
        List<String> oddsIds) {
}
