package com.betolyn.features.betting.betslips.bulkvoidodd;

import java.util.List;

import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;

public record BulkVoidOddParam(
        String referenceId,
        TransactionReferenceTypeEnum referenceType,
        TransactionTypeEnum voidType,
                String reason,
                        String referenceName,
        List<String> oddsIds) {
}
