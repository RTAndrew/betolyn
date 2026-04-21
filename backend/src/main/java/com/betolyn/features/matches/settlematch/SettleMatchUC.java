package com.betolyn.features.matches.settlematch;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.account.findglobalescrowaccount.FindGlobalEscrowAccountUC;
import com.betolyn.features.bankroll.account.findglobalreserveaccount.FindGlobalReserveAccountUC;
import com.betolyn.features.bankroll.transaction.*;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipItemEntity;
import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import com.betolyn.features.betting.betslips.enums.CreateSpaceTXIEnum;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.findmatchcriteria.FindMatchCriteriaUC;
import com.betolyn.features.matches.matchSystemEvents.MatchSettledEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;
import com.betolyn.shared.money.BetMoney;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.betolyn.features.betting.BettingUtils.createSpaceTXIForLockOrRelease;

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
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;

    @Override
    @Transactional
    public Void execute(String matchId) {
        var authenticatedUser = getAuthenticatedUserUC.execute()
                .orElseThrow(AccessForbiddenException::new)
                .user();

        MatchEntity match = findMatchByIdUC.execute(matchId);
        if (match.getSettledAt() != null) {
            return null;
        }
        if (match.getEffectiveStatus() != MatchStatusEnum.ENDED) {
            throw new BadRequestException("MATCH_NOT_ENDED", "Match must be ended before settling");
        }

        List<CriterionEntity> criteria = findMatchCriteriaUC.execute(matchId);
        // criterion.status == SUSPENDED,
        // and at least one odd is suspended and winner
        boolean readyToSettle = criteria.stream().allMatch(
                c -> c.getStatus() == CriterionStatusEnum.SUSPENDED &&
                        c.getOdds() != null &&
                        c.getOdds().stream().anyMatch(
                                o -> o.getStatus() == OddStatusEnum.SUSPENDED && Boolean.TRUE.equals(o.getIsWinner())));
        if (!readyToSettle) {
            throw new BadRequestException("CRITERIA_NOT_READY", "Suspend the market and set a winner before settling");
        }

        List<BetSlipItemEntity> items = betSlipItemRepository.findAllByMatchIdAndBetSlipStatusAndStatus(
                matchId, BetSlipStatusEnum.PENDING, BetSlipItemStatusEnum.PENDING);

        if (items.isEmpty()) {
            var settledAt = LocalDateTime.now();
            match.setSettledAt(settledAt);
            matchRepository.save(match);
            matchSystemEvent.publish(this, new MatchSseEvent.MatchSettled(new MatchSettledEventDTO(matchId, settledAt)));
            return null;
        }

        var globalEscrow = findGlobalEscrowAccountUC.execute(null);
        var globalReserve = findGlobalReserveAccountUC.execute(null);
        Map<String, AccountEntity> userAccountByOwnerId = new HashMap<>();
        Map<String, AccountEntity> spaceAccountsBySpaceId = new HashMap<>();

        Map<SettlementTxBatchPerUser, List<TransactionItemEntity>> userWinningGroupedTXItems = new HashMap<>();
        Map<SettlementTxBatchPerAccount, List<TransactionItemEntity>> spaceLosingGroupedTXItems = new HashMap<>();
        Map<SettlementTxBatchPerAccount, List<TransactionItemEntity>> globalLosingGroupedTXItems = new HashMap<>();

        var MATCH_TOTAL_STAKES = BetMoney.zero();

        HashMap<String, List<BetSlipItemEntity>> winnerBetsGroupedByOddId = new HashMap<>();
        HashMap<String, List<BetSlipItemEntity>> lostBetsGroupedByOddId = new HashMap<>();
        for (var bet : items) {
            var oddId = bet.getOdd().getId();

            MATCH_TOTAL_STAKES = bet.getStake().add(MATCH_TOTAL_STAKES);

            if (Boolean.FALSE.equals(bet.getOdd().getIsWinner())) {
                lostBetsGroupedByOddId.computeIfAbsent(oddId, k -> new ArrayList<>()).add(bet);
            } else {
                winnerBetsGroupedByOddId.computeIfAbsent(oddId, k -> new ArrayList<>()).add(bet);
            }
        }

        // There is no SPACE_BET_POOL where all the user bets gets saved/secured by the
        // space,
        // instead it is saved in the GLOBAL ESCROW.
        // So, we account match.reservedLiability (which is the same as the
        // spaceAccount.balanceReserved)
        // to increase our buffer and be able to process the settlement
        // BUCKET = ESCROW + match.getReservedLiability
        var MATCH_BUCKET = match.getReservedLiability().add(MATCH_TOTAL_STAKES);

        // WINNERS
        var winnerItems = winnerBetsGroupedByOddId.values().stream()
                .flatMap(List::stream)
                .toList();
        for (var item : winnerItems) {
            var stake = item.getStake();
            var potentialPayout = item.getPotentialPayout();
            var profitToPay = potentialPayout.subtract(stake); // same as liability

            var bettorId = item.getBetSlip().getCreatedBy().getId();
            var bettorAccount = userAccountByOwnerId.computeIfAbsent(bettorId, findAccountByOwnerIdUC::execute);

            // prepare transaction items
            var txStakeReturn = new TransactionItemEntity();
            txStakeReturn.generateId();
            txStakeReturn.setAmount(stake);
            txStakeReturn.setToAccountId(bettorAccount.getId());
            txStakeReturn.setToAccountType(AccountTypeEnum.USER_WALLET);
            txStakeReturn.setFromAccountId(globalEscrow.getId());
            txStakeReturn.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            txStakeReturn.setType(TransactionItemTypeEnum.WIN_PAYOUT_STAKE);
            txStakeReturn.setReferenceMatchId(matchId);
            txStakeReturn.setReferenceBetSlipId(item.getBetSlip().getId());

            var txProfitToPay = new TransactionItemEntity();
            txProfitToPay.generateId();
            txProfitToPay.setAmount(profitToPay);
            txProfitToPay.setToAccountId(bettorAccount.getId());
            txProfitToPay.setToAccountType(AccountTypeEnum.USER_WALLET);
            txProfitToPay.setType(TransactionItemTypeEnum.WIN_PAYOUT_PROFIT);
            txProfitToPay.setReferenceMatchId(matchId);
            txProfitToPay.setReferenceBetSlipId(item.getBetSlip().getId());

            if (item.getOdd().getCriterion().getMatch().isSpaceOwned()) {
                var spaceId = item.getOdd().getCriterion().getMatch().getSpaceId();
                var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);
                // no need to debit from space reserved. it's handled right before the end of
                // execution

                // TODO: test a scenario where bets are only in one place and the space loses
                // money (it should come from the space reserved, since the liability will take
                // care of it on bet placement)
                txProfitToPay.setFromAccountId(spaceAccount.getId());
                txProfitToPay.setFromAccountType(AccountTypeEnum.SPACE_RESERVED);
            } else {
                globalReserve.debit(profitToPay);
                txProfitToPay.setFromAccountId(globalReserve.getId());
                txProfitToPay.setFromAccountType(AccountTypeEnum.GLOBAL); // the house always has money
            }

            MATCH_BUCKET = MATCH_BUCKET.subtract(potentialPayout); // reduce the bucket

            globalEscrow.debit(stake); // always debit from global escrow (money held by the platform)
            bettorAccount.releaseFunds(stake);
            bettorAccount.credit(profitToPay);

            item.setStatus(BetSlipItemStatusEnum.WON);

            var batchUser = new SettlementTxBatchPerUser(bettorId);
            userWinningGroupedTXItems.computeIfAbsent(batchUser, k -> new ArrayList<>()).add(txStakeReturn);
            userWinningGroupedTXItems.computeIfAbsent(batchUser, k -> new ArrayList<>()).add(txProfitToPay);
        }

        // LOST
        var lostItems = lostBetsGroupedByOddId.values().stream()
                .flatMap(List::stream)
                .toList();
        for (var item : lostItems) {
            var stake = item.getStake();

            var bettorId = item.getBetSlip().getCreatedBy().getId();
            var bettorAccount = userAccountByOwnerId.computeIfAbsent(bettorId, findAccountByOwnerIdUC::execute);

            var txStakeCollection = new TransactionItemEntity();
            txStakeCollection.generateId();
            txStakeCollection.setAmount(stake);
            txStakeCollection.setFromAccountId(globalEscrow.getId());
            txStakeCollection.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            txStakeCollection.setType(TransactionItemTypeEnum.LOSS_COLLECTION);
            txStakeCollection.setReferenceMatchId(matchId);
            txStakeCollection.setReferenceBetSlipId(item.getBetSlip().getId());

            if (item.getOdd().getCriterion().getMatch().isSpaceOwned()) {
                var spaceId = item.getOdd().getCriterion().getMatch().getSpaceId();
                var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);

                spaceAccount.credit(stake);

                txStakeCollection.setToAccountId(spaceAccount.getId());
                txStakeCollection.setToAccountType(AccountTypeEnum.SPACE_AVAILABLE);

                spaceLosingGroupedTXItems
                        .computeIfAbsent(new SettlementTxBatchPerAccount(spaceAccount.getId()), k -> new ArrayList<>())
                        .add(txStakeCollection);
            } else {
                globalReserve.credit(stake);

                txStakeCollection.setToAccountId(globalReserve.getId());
                txStakeCollection.setToAccountType(AccountTypeEnum.GLOBAL);

                globalLosingGroupedTXItems
                        .computeIfAbsent(new SettlementTxBatchPerAccount(globalReserve.getId()), k -> new ArrayList<>())
                        .add(txStakeCollection);
            }

            globalEscrow.debit(stake); // always debit from global escrow (money held by the platform)
            bettorAccount.consumeReservedStake(stake); // bettor looses the bet

            item.setStatus(BetSlipItemStatusEnum.LOST);
        }

        if (match.isSpaceOwned()) {
            var spaceId = match.getSpaceId();
            var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);

            // since the money was already allocated in the MATCH_BUCKET
            // it must be removed from the reservedBalance
            spaceAccount.consumeReservedStake(match.getReservedLiability());

            if (MATCH_BUCKET.isGreaterThan(BetMoney.zero())) {
                spaceAccount.credit(MATCH_BUCKET);

                var txReleaseReserve = createSpaceTXIForLockOrRelease(CreateSpaceTXIEnum.RELEASE, null, MATCH_BUCKET, spaceAccount);
                spaceLosingGroupedTXItems
                        .computeIfAbsent(new SettlementTxBatchPerAccount(spaceAccount.getId()), k -> new ArrayList<>())
                        .add(txReleaseReserve);
            }
        } else if (MATCH_BUCKET.isGreaterThan(BetMoney.zero())) {
            globalReserve.credit(MATCH_BUCKET); // the platform wins
        }

        // update bet slip status
        var affectedSlips = items.stream().map(BetSlipItemEntity::getBetSlip).distinct().toList();
        affectedSlips.forEach(BetSlipEntity::syncStatusFromItems);

        // create TXs
        var matchReferenceName = match.getDisplayName();
        this.createTransactionBatches(matchId, matchReferenceName, userWinningGroupedTXItems, authenticatedUser);
        this.createTransactionBatches(matchId, matchReferenceName, spaceLosingGroupedTXItems, authenticatedUser);
        this.createTransactionBatches(matchId, matchReferenceName, globalLosingGroupedTXItems, authenticatedUser);

        var settledAt = LocalDateTime.now();
        match.setSettledAt(settledAt);
        matchRepository.save(match);
        matchSystemEvent.publish(this, new MatchSseEvent.MatchSettled(new MatchSettledEventDTO(matchId, settledAt)));

        return Void.TYPE.cast(null);
    }

    private <K> void createTransactionBatches(
            String matchId,
            String referenceName,
            Map<K, List<TransactionItemEntity>> batches,
            UserEntity createdBy) {

        for (var entry : batches.entrySet()) {
            var txItems = entry.getValue();

            if (txItems == null || txItems.isEmpty()) {
                continue;
            }

            var tx = new TransactionEntity();
            tx.generateId();
            tx.setReferenceId(matchId);
            tx.setCreatedBy(createdBy);
            tx.setType(TransactionTypeEnum.MATCH_SETTLEMENT);
            tx.setReferenceType(TransactionReferenceTypeEnum.MATCH);
            tx.setReferenceName(referenceName);

            for (var item : txItems) {
                item.setTransaction(tx);
                tx.getItems().add(item);
            }

            transactionRepository.save(tx);
        }
    }

    /**
     * One persisted {@link TransactionEntity} per bettor
     * ({@link UserEntity#getId()}).
     */
    private record SettlementTxBatchPerUser(String userId) {
    }

    /**
     * One persisted {@link TransactionEntity} per bankroll account
     * ({@link AccountEntity#getId()}).
     */
    private record SettlementTxBatchPerAccount(String accountId) {
    }
}
