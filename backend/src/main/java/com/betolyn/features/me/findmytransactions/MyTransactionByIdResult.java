package com.betolyn.features.me.findmytransactions;

import com.betolyn.features.bankroll.transaction.TransactionEntity;

public record MyTransactionByIdResult(TransactionEntity transaction, String viewerAccountId) {
}
