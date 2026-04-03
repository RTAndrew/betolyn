package com.betolyn.features.matches.settlematch;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.account.findglobalescrowaccount.FindGlobalEscrowAccountUC;
import com.betolyn.features.bankroll.account.findglobalreserveaccount.FindGlobalReserveAccountUC;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipItemEntity;
import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.findmatchcriteria.FindMatchCriteriaUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SettleMatchUC implements IUseCase<String, Void> {

    private final FindMatchByIdUC findMatchByIdUC;
    private final FindMatchCriteriaUC findMatchCriteriaUC;
    private final BetSlipItemRepository betSlipItemRepository;
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;
    private final FindGlobalEscrowAccountUC findGlobalEscrowAccountUC;
    private final FindGlobalReserveAccountUC findGlobalReserveAccountUC;
    private final TransactionRepository transactionRepository;
    private final CriterionRepository criterionRepository;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;

    @Override
    @SuppressWarnings("ALL")
    @Transactional
    public Void execute(String matchId) {
        var loggedUser = getAuthenticatedUserUC.execute()
                .orElseThrow(AccessForbiddenException::new)
                .user();

        MatchEntity match = findMatchByIdUC.execute(matchId);
        if (match.getEffectiveStatus() != MatchStatusEnum.ENDED) {
            throw new BadRequestException("MATCH_NOT_ENDED", "Match must be ended before settling");
        }

        List<CriterionEntity> criteria = findMatchCriteriaUC.execute(matchId);
        // criterion.status == SUSPENDED,
        // and at least one odd is suspended and winner
        boolean readyToSettle = criteria.stream().allMatch(c -> c.getStatus() == CriterionStatusEnum.SUSPENDED &&
                c.getOdds() != null &&
                c.getOdds().stream().anyMatch(
                        o -> o.getStatus() == OddStatusEnum.SUSPENDED && Boolean.TRUE.equals(o.getIsWinner())));
        if (!readyToSettle) {
            throw new BadRequestException("CRITERIA_NOT_READY", "Suspend the market and set a winner before settling");
        }

        // TODO: pass array of status (including VOIDED)
        // otherwise the VOID check will not be reached
        List<BetSlipItemEntity> items = betSlipItemRepository.findAllByMatchIdAndBetSlipStatusAndStatus(
                matchId, BetSlipStatusEnum.PENDING, BetSlipItemStatusEnum.PENDING);

        if (items.isEmpty()) {
            return null; // idempotent: already settled
        }

        AccountEntity globalEscrow = findGlobalEscrowAccountUC.execute(null);
        AccountEntity globalReserve = findGlobalReserveAccountUC.execute(null);
        Map<String, AccountEntity> userAccountByOwnerId = new HashMap<>();

        TransactionEntity transaction = new TransactionEntity();
        transaction.setType(TransactionTypeEnum.MATCH_SETTLEMENT);
        transaction.setReferenceType(TransactionReferenceTypeEnum.MATCH);
        transaction.setReferenceId(matchId);
        // Audit: who initiated settlement (e.g. admin who clicked "Settle match")
        transaction.setCreatedBy(loggedUser);

        Map<String, AccountEntity> spaceAccountsBySpaceId = new HashMap<>();
        List<BetSlipItemEntity> voidedItems = items.stream()
                .filter(i -> i.getOdd().getStatus() == OddStatusEnum.VOID)
                .toList();
        List<BetSlipItemEntity> validItems = items.stream()
                .filter(i -> i.getOdd().getStatus() == OddStatusEnum.SUSPENDED
                        && i.getOdd().getCriterion().getStatus() == CriterionStatusEnum.SUSPENDED)
                .toList();

        // 1. VOID (refund)
        for (BetSlipItemEntity item : voidedItems) {
            var stake = item.getStake();
            var potentialPayout = item.getPotentialPayout();
            var liability = potentialPayout.subtract(stake);

            String ownerId = item.getBetSlip().getCreatedBy().getId();
            AccountEntity userAccount = userAccountByOwnerId.computeIfAbsent(ownerId, findAccountByOwnerIdUC::execute);

            TransactionItemEntity globalEscrowToUserTX = new TransactionItemEntity();
            globalEscrowToUserTX.setTransaction(transaction);
            globalEscrowToUserTX.setAmount(stake);
            globalEscrowToUserTX.setToAccountId(userAccount.getId());
            globalEscrowToUserTX.setToAccountType(AccountTypeEnum.USER_WALLET);
            globalEscrowToUserTX.setFromAccountId(globalEscrow.getId());
            globalEscrowToUserTX.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);

            if (item.getOdd().getCriterion().getMatch().isSpaceOwned()) {
                // 1.1 Release SPACE funds
                var spaceId = item.getOdd().getCriterion().getMatch().getSpaceId();
                var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);

                // TODO: find a way to solve it
                // because it's balacedReserved != SUM(liabilities)
                // Without it works, but at the end the balacedReserved must be released
//                spaceAccount.releaseFunds(liability);

                var releaseSpaceFundsTXI = new TransactionItemEntity();
                releaseSpaceFundsTXI.setTransaction(transaction);
                releaseSpaceFundsTXI.setAmount(liability);
                releaseSpaceFundsTXI.setFromAccountId(spaceAccount.getId());
                releaseSpaceFundsTXI.setFromAccountType(AccountTypeEnum.SPACE_RESERVED);
                releaseSpaceFundsTXI.setToAccountId(spaceAccount.getId());
                releaseSpaceFundsTXI.setToAccountType(AccountTypeEnum.SPACE_AVAILABLE);
            } else {
                // 1.2 Release GLOBAL ESCROW funds
                // No need to release funds from GLOBAL RESERVE here
                // because there is no such a thing for the HOUSE
                // The house always has enough funds to cover the liability

                var releaseGlobalEscrowFundsTXI = new TransactionItemEntity();
                releaseGlobalEscrowFundsTXI.setTransaction(transaction);
                releaseGlobalEscrowFundsTXI.setAmount(stake);
                releaseGlobalEscrowFundsTXI.setFromAccountId(globalEscrow.getId());
                releaseGlobalEscrowFundsTXI.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
                releaseGlobalEscrowFundsTXI.setToAccountId(globalReserve.getId());
                releaseGlobalEscrowFundsTXI.setToAccountType(AccountTypeEnum.GLOBAL);
            }

            globalEscrow.debit(stake);
            // 1.3 Release USER funds
            userAccount.releaseFunds(stake);
            transaction.getItems().add(globalEscrowToUserTX);
            item.setStatus(BetSlipItemStatusEnum.VOIDED); // odd stays VOID (refunded)
        }

        //
        // #region 2. LOSERS
        for (BetSlipItemEntity item : validItems) {
            if (Boolean.TRUE.equals(item.getOdd().getIsWinner())) {
                continue;
            }

            var stake = item.getStake();
            var potentialPayout = item.getPotentialPayout();
            var liability = potentialPayout.subtract(stake);

            var ownerId = item.getBetSlip().getCreatedBy().getId();
            var userAccount = userAccountByOwnerId.computeIfAbsent(ownerId, findAccountByOwnerIdUC::execute);

            // TODO: remove and create a unified TX per user?
//            TransactionItemEntity txi = new TransactionItemEntity();
//            txi.setTransaction(transaction);
//            txi.setAmount(stake);

            if (item.getOdd().getCriterion().getMatch().isSpaceOwned()) {
                // 1.1 Move funds from SPACE RESERVED to SPACE AVAILABLE
                var spaceId = item.getOdd().getCriterion().getMatch().getSpaceId();
                var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);

                // TODO: find a way to solve it
                // because it's balacedReserved != SUM(liabilities)
//                spaceAccount.releaseFunds(liability);
                spaceAccount.credit(stake);

                var releaseSpaceFundsTXI = new TransactionItemEntity();
                releaseSpaceFundsTXI.setTransaction(transaction);
                releaseSpaceFundsTXI.setAmount(liability);
                releaseSpaceFundsTXI.setFromAccountId(globalEscrow.getId());
                releaseSpaceFundsTXI.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
                releaseSpaceFundsTXI.setToAccountId(spaceAccount.getId());
                releaseSpaceFundsTXI.setToAccountType(AccountTypeEnum.SPACE_AVAILABLE);
            } else {
                // 1.2 Move funds from GLOBAL ESCROW to GLOBAL RESERVE
                globalReserve.credit(stake);

                var releaseGlobalEscrowFundsTXI = new TransactionItemEntity();
                releaseGlobalEscrowFundsTXI.setTransaction(transaction);
                releaseGlobalEscrowFundsTXI.setAmount(stake);
                releaseGlobalEscrowFundsTXI.setFromAccountId(globalEscrow.getId());
                releaseGlobalEscrowFundsTXI.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
                releaseGlobalEscrowFundsTXI.setToAccountId(globalReserve.getId());
                releaseGlobalEscrowFundsTXI.setToAccountType(AccountTypeEnum.GLOBAL);
            }

            globalEscrow.debit(stake); // always debit from global escrow (money held by the platform)
            userAccount.consumeReservedStake(stake); // user loses stake permanently

//            transaction.getItems().add(txi);
            item.setStatus(BetSlipItemStatusEnum.LOST);
            item.getOdd().setStatus(OddStatusEnum.SETTLED);
        }
        // #endregion

        // 3. WINNERS
        for (BetSlipItemEntity item : validItems) {
            if (!Boolean.TRUE.equals(item.getOdd().getIsWinner())) {
                continue;
            }

            var stake = item.getStake();
            var potentialPayout = item.getPotentialPayout();
            var profit = potentialPayout.subtract(stake); // same as liability
            var ownerId = item.getBetSlip().getCreatedBy().getId();
            var userAccount = userAccountByOwnerId.computeIfAbsent(ownerId, findAccountByOwnerIdUC::execute);

//            TransactionItemEntity txi = new TransactionItemEntity();
//            txi.setTransaction(transaction);
//            txi.setAmount(profit);
//            txi.setToAccountId(userAccount.getId());
//            txi.setToAccountType(AccountTypeEnum.USER_WALLET);

            if (item.getOdd().getCriterion().getMatch().isSpaceOwned()) {
                // 1.1 Move funds from SPACE RESERVED to SPACE AVAILABLE
                var spaceId = item.getOdd().getCriterion().getMatch().getSpaceId();
                var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);

                // channel pays the profit to the user
                // while the stake goes from ESCROW to USER_WALLET
                spaceAccount.consumeReservedStake(profit);

                var releaseSpaceFundsTXI = new TransactionItemEntity();
                releaseSpaceFundsTXI.setTransaction(transaction);
                releaseSpaceFundsTXI.setAmount(profit);
                releaseSpaceFundsTXI.setFromAccountId(spaceAccount.getId());
                releaseSpaceFundsTXI.setFromAccountType(AccountTypeEnum.SPACE_RESERVED);
                releaseSpaceFundsTXI.setToAccountId(spaceAccount.getId());
                releaseSpaceFundsTXI.setToAccountType(AccountTypeEnum.SPACE_AVAILABLE);
            } else {
                // 1.2 Reduce GLOBAL RESERVE and GLOBAL ESCROW
                // and move funds from GLOBAL RESERVE to USER WALLET

                globalReserve.debit(profit);

                var releaseGlobalReserveFundsTXI = new TransactionItemEntity();
                releaseGlobalReserveFundsTXI.setTransaction(transaction);
                releaseGlobalReserveFundsTXI.setAmount(profit);
                releaseGlobalReserveFundsTXI.setFromAccountId(globalReserve.getId());
                releaseGlobalReserveFundsTXI.setFromAccountType(AccountTypeEnum.GLOBAL);
                releaseGlobalReserveFundsTXI.setToAccountId(userAccount.getId());
                releaseGlobalReserveFundsTXI.setToAccountType(AccountTypeEnum.USER_WALLET);
            }

            globalEscrow.debit(stake); // always debit from global escrow (money held by the platform)
            var releaseGlobalEscrowFundsTXI = new TransactionItemEntity();
            releaseGlobalEscrowFundsTXI.setTransaction(transaction);
            releaseGlobalEscrowFundsTXI.setAmount(stake);
            releaseGlobalEscrowFundsTXI.setFromAccountId(globalEscrow.getId());
            releaseGlobalEscrowFundsTXI.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            releaseGlobalEscrowFundsTXI.setToAccountId(globalReserve.getId());
            releaseGlobalEscrowFundsTXI.setToAccountType(AccountTypeEnum.GLOBAL);

            userAccount.credit(profit); // user wins profit
            userAccount.releaseFunds(stake); // user wins stake back

//            transaction.getItems().add(txi);
            item.setStatus(BetSlipItemStatusEnum.WON);
            item.getOdd().setStatus(OddStatusEnum.SETTLED);
        }

        // 4. Final status updates
        List<CriterionEntity> suspendedCriteria = criterionRepository.findAllByMatchId(matchId,
                List.of(CriterionStatusEnum.SUSPENDED));
        for (CriterionEntity c : suspendedCriteria) {
            c.setStatus(CriterionStatusEnum.SETTLED);
        }
        criterionRepository.saveAll(suspendedCriteria);

        List<BetSlipEntity> affectedSlips = items.stream().map(BetSlipItemEntity::getBetSlip).distinct().toList();
        for (BetSlipEntity slip : affectedSlips) {
            List<BetSlipItemEntity> slipItems = slip.getItems();
            boolean anyLost = slipItems.stream().anyMatch(i -> i.getStatus() == BetSlipItemStatusEnum.LOST);
            boolean anyWon = slipItems.stream().anyMatch(i -> i.getStatus() == BetSlipItemStatusEnum.WON);
            boolean allVoided = slipItems.stream().allMatch(i -> i.getStatus() == BetSlipItemStatusEnum.VOIDED);
            if (anyLost) {
                slip.setStatus(BetSlipStatusEnum.LOST);
            } else if (anyWon) {
                slip.setStatus(BetSlipStatusEnum.WON);
            } else if (allVoided) {
                slip.setStatus(BetSlipStatusEnum.VOIDED);
            }
        }

        transactionRepository.save(transaction);
        return Void.TYPE.cast(null);
    }
}
