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
import com.betolyn.shared.money.BetMoney;

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

        List<BetSlipItemEntity> voidedItems = items.stream()
                .filter(i -> i.getOdd().getStatus() == OddStatusEnum.VOID)
                .toList();
        List<BetSlipItemEntity> validItems = items.stream()
                .filter(i -> i.getOdd().getStatus() == OddStatusEnum.SUSPENDED
                        && i.getOdd().getCriterion().getStatus() == CriterionStatusEnum.SUSPENDED)
                .toList();

        // 1. VOID (refund)
        for (BetSlipItemEntity item : voidedItems) {
            BetMoney stake = item.getStake();
            String ownerId = item.getBetSlip().getCreatedBy().getId();
            AccountEntity userAccount = userAccountByOwnerId.computeIfAbsent(ownerId, findAccountByOwnerIdUC::execute);

            userAccount.releaseFunds(stake);
            globalEscrow.setBalanceAvailable(globalEscrow.getBalanceAvailable().subtract(stake));
            item.setStatus(BetSlipItemStatusEnum.VOIDED); // odd stays VOID (refunded)

            TransactionItemEntity txi = new TransactionItemEntity();
            txi.setTransaction(transaction);
            txi.setFromAccountId(globalEscrow.getId());
            txi.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            txi.setToAccountId(userAccount.getId());
            txi.setToAccountType(AccountTypeEnum.USER_WALLET);
            txi.setAmount(stake);
            transaction.getItems().add(txi);
        }

        // 2. LOSERS
        for (BetSlipItemEntity item : validItems) {
            if (Boolean.TRUE.equals(item.getOdd().getIsWinner())) {
                continue;
            }

            BetMoney stake = item.getStake();
            String ownerId = item.getBetSlip().getCreatedBy().getId();
            AccountEntity userAccount = userAccountByOwnerId.computeIfAbsent(ownerId, findAccountByOwnerIdUC::execute);

            userAccount.consumeReservedStake(stake);
            globalEscrow.setBalanceAvailable(globalEscrow.getBalanceAvailable().subtract(stake));
            globalReserve.setBalanceAvailable(globalReserve.getBalanceAvailable().add(stake));
            item.setStatus(BetSlipItemStatusEnum.LOST);
            item.getOdd().setStatus(OddStatusEnum.SETTLED);

            TransactionItemEntity txi = new TransactionItemEntity();
            txi.setTransaction(transaction);
            txi.setFromAccountId(globalEscrow.getId());
            txi.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            txi.setToAccountId(globalReserve.getId());
            txi.setToAccountType(AccountTypeEnum.GLOBAL);
            txi.setAmount(stake);
            transaction.getItems().add(txi);
        }

        // 3. WINNERS
        for (BetSlipItemEntity item : validItems) {
            if (!Boolean.TRUE.equals(item.getOdd().getIsWinner())) {
                continue;
            }

            BetMoney stakeMoney = item.getStake();
            BetMoney potentialPayoutMoney = item.getPotentialPayout();
            BetMoney profit = potentialPayoutMoney.subtract(stakeMoney);
            String ownerId = item.getBetSlip().getCreatedBy().getId();
            AccountEntity userAccount = userAccountByOwnerId.computeIfAbsent(ownerId, findAccountByOwnerIdUC::execute);

            userAccount.releaseFunds(stakeMoney);
            userAccount.setBalanceAvailable(userAccount.getBalanceAvailable().add(profit));
            globalEscrow.setBalanceAvailable(globalEscrow.getBalanceAvailable().subtract(stakeMoney));
            globalReserve.setBalanceAvailable(globalReserve.getBalanceAvailable().subtract(profit));
            item.setStatus(BetSlipItemStatusEnum.WON);
            item.getOdd().setStatus(OddStatusEnum.SETTLED);

            TransactionItemEntity txi = new TransactionItemEntity();
            txi.setTransaction(transaction);
            txi.setFromAccountId(globalReserve.getId());
            txi.setFromAccountType(AccountTypeEnum.GLOBAL);
            txi.setToAccountId(userAccount.getId());
            txi.setToAccountType(AccountTypeEnum.USER_WALLET);
            txi.setAmount(profit);
            transaction.getItems().add(txi);
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
