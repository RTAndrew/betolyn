package com.betolyn.features.betting.betslips.voiding.bulkvoidodd;

import java.util.List;

import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.odds.OddEntity;

import jakarta.annotation.Nullable;

public record BulkVoidOddParam(
                String referenceId,
                                TransactionReferenceTypeEnum referenceType,
                TransactionTypeEnum voidType,
                String reason,
                String referenceName,
                                List<String> oddsIds,
                @Nullable List<OddEntity> odds) {
}
