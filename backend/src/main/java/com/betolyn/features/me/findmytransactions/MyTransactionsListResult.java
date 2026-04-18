package com.betolyn.features.me.findmytransactions;

import java.util.List;

import com.betolyn.features.bankroll.transaction.TransactionEntity;

public record MyTransactionsListResult(List<TransactionEntity> transactions, String viewerAccountId) {
}
