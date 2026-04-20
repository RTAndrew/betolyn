package com.betolyn.features.betting;

import java.util.List;
import java.util.Objects;

import org.jetbrains.annotations.NotNull;
import org.jspecify.annotations.Nullable;

import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemTypeEnum;
import com.betolyn.features.betting.betslips.enums.CreateSpaceTXIEnum;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.shared.money.BetMoney;

public final class BettingUtils {

    /** Odds that are not already settled or voided can be voided. */
    public static boolean isOddVoidable(OddEntity odd) {
        var NON_VOIDABLE_ODD_STATUSES = List.of(OddStatusEnum.SETTLED, OddStatusEnum.VOID);
        return !NON_VOIDABLE_ODD_STATUSES.contains(odd.getStatus());
    }

    /**
     * Takes the worst-scenario liability within a criterion:
     * potentialPayoutVolume - totalStakesVolume.
     * Skips odds that are already voided or settled.
     */
    public static BetMoney calculateCriterionReservedLiability(CriterionEntity criterion) {
        BetMoney maxLiability = BetMoney.zero();
        for (var criterionOdd : criterion.getOdds()) {
            if (criterionOdd.getStatus() == OddStatusEnum.VOID || criterionOdd.getStatus() == OddStatusEnum.SETTLED) {
                continue;
            }
            // marketLiability = odd.potentialPayoutVolume - criterion.totalStakesVolume
            // if marketLiability < 0, then liability = 0 (profit for the house)
            BetMoney liability = criterionOdd.getPotentialPayoutVolume().subtract(criterion.getTotalStakesVolume());
            if (liability.isGreaterThan(maxLiability)) {
                maxLiability = liability;
            }
        }
        return maxLiability;
    }

    public static BetMoney calculateMatchReservedLiability(List<CriterionEntity> matchCriteria,
            CriterionEntity criterion, BetMoney newCriterionReservedLiability) {
        BetMoney maxLiability = BetMoney.zero();

        for (var matchCriterion : matchCriteria) {
            BetMoney liability = Objects.equals(matchCriterion.getId(), criterion.getId())
                    ? newCriterionReservedLiability
                    : matchCriterion.getReservedLiability();

            if (liability != null && liability.isGreaterThan(maxLiability)) {
                maxLiability = liability;
            }
        }
        return maxLiability;
    }

    public static @NotNull TransactionItemEntity createSpaceTXIForLockOrRelease(CreateSpaceTXIEnum operation,
            @Nullable TransactionEntity transaction, BetMoney matchDeltaReservedLiability, AccountEntity spaceAccount) {
        var transactionItem = new TransactionItemEntity();
        transactionItem.setTransaction(transaction);
        transactionItem.setAmount(matchDeltaReservedLiability.abs());

        if (operation.equals(CreateSpaceTXIEnum.LOCK)) {
            transactionItem.setType(TransactionItemTypeEnum.LIABILITY_RESERVE);
            transactionItem.setFromAccountId(spaceAccount.getId());
            transactionItem.setFromAccountType(AccountTypeEnum.SPACE_AVAILABLE);
            transactionItem.setToAccountId(spaceAccount.getId());
            transactionItem.setToAccountType(AccountTypeEnum.SPACE_RESERVED);
        } else {
            transactionItem.setType(TransactionItemTypeEnum.LIABILITY_RELEASE);
            transactionItem.setFromAccountId(spaceAccount.getId());
            transactionItem.setFromAccountType(AccountTypeEnum.SPACE_RESERVED);
            transactionItem.setToAccountId(spaceAccount.getId());
            transactionItem.setToAccountType(AccountTypeEnum.SPACE_AVAILABLE);
        }

        if (!Objects.isNull(transaction)) {
            transaction.getItems().add(transactionItem);
        }

        return transactionItem;
    }

    private BettingUtils() {
    }
}
