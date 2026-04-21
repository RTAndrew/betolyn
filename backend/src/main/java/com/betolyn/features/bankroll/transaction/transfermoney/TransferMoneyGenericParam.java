package com.betolyn.features.bankroll.transaction.transfermoney;

import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.shared.money.BetMoney;

import lombok.Builder;
import lombok.NonNull;

@Builder
public record TransferMoneyGenericParam(
                @NonNull String transactionReferenceName,
                                @NonNull TransactionReferenceTypeEnum transactionReferenceType,
                @NonNull String transactionReferenceId,

                String memo,

                /* The entity (owner) ID that owns the account */
                                @NonNull String fromOwnerId,

                /* The balance type */
                                @NonNull AccountTypeEnum fromAccountType,

                /* The entity (owner) ID that owns the account */
                                @NonNull String toOwnerId,

                /* The balance type */
                                @NonNull AccountTypeEnum toAccountType,

                @NonNull TransactionTypeEnum transactionType,
                
                @NonNull BetMoney amount) {
}
