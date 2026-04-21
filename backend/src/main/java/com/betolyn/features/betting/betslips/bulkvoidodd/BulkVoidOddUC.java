package com.betolyn.features.betting.betslips.bulkvoidodd;

import static com.betolyn.features.betting.BettingUtils.calculateMatchReservedLiability;
import static com.betolyn.features.betting.BettingUtils.createSpaceTXIForLockOrRelease;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.account.findglobalescrowaccount.FindGlobalEscrowAccountUC;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.BettingUtils;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipItemEntity;
import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.betslips.enums.CreateSpaceTXIEnum;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.betting.odds.OddSseEvent;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.dto.OddStatusChangedEventDTO;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.findmatchcriteria.FindMatchCriteriaUC;
import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.money.BetMoney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BulkVoidOddUC implements IUseCase<BulkVoidOddParam, MatchEntity> {
    private final OddRepository oddRepository;
    private final FindMatchCriteriaUC findMatchCriteriaUC;
    private final TransactionRepository transactionRepository;
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindGlobalEscrowAccountUC findGlobalEscrowAccountUC;

    private final BetSlipItemRepository betSlipItemRepository;
    private final OddSystemEvent oddSystemEvent;

    private final List<OddStatusEnum> INVALID_ODD_STATUSES = List
            .of(new OddStatusEnum[] { OddStatusEnum.SETTLED, OddStatusEnum.VOID });

    @Override
    @Transactional
    public MatchEntity execute(BulkVoidOddParam paramDTO) {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);

        var odds = oddRepository.findAllById(paramDTO.oddsIds());
        var match = validateOdds(paramDTO.oddsIds(), odds);

        var matchCriteria = findMatchCriteriaUC.execute(match.getId());
        Optional<AccountEntity> spaceAccount = Optional.empty();
        if (match.isSpaceOwned()) {
            spaceAccount = Optional.of(findAccountByOwnerIdUC.execute(match.getSpaceId()));
        }

        // 1. Prepare space TX
        var spaceTX = new TransactionEntity();
        spaceTX.generateId();
        spaceTX.setType(paramDTO.voidType());
        spaceTX.setReferenceId(paramDTO.referenceId());
        spaceTX.setReferenceType(paramDTO.referenceType());
        spaceTX.setReferenceName(paramDTO.referenceName());
        spaceTX.setMemo(paramDTO.reason());

        // 2. Criterion and Odd projection recalculation
        // TODO: this can be simplified by summing all the
        for (var odd : odds) {
            odd.setStatus(OddStatusEnum.VOID);

            var criterion = odd.getCriterion();

            var oddTotalStakesVolume = odd.getTotalStakesVolume();
            var oddTotalBetsCount = odd.getTotalBetsCount();
            criterion.setTotalStakesVolume(
                    criterion.getTotalStakesVolume().subtract(oddTotalStakesVolume));
            criterion.setTotalBetsCount(
                    criterion.getTotalBetsCount() - oddTotalBetsCount);

            // 2.1 recalculate market liability
            var newCriterionReservedLiability = BettingUtils.calculateCriterionReservedLiability(criterion);
            criterion.setReservedLiability(newCriterionReservedLiability);

            // 2.2 recalculate market liability
            var oldMatchReservedLiability = criterion.getMatch().getReservedLiability();
            var newMatchReservedLiability = calculateMatchReservedLiability(
                    matchCriteria,
                    criterion,
                    newCriterionReservedLiability);
            criterion.getMatch().setReservedLiability(newMatchReservedLiability);
            var matchDeltaReservedLiability = newMatchReservedLiability.subtract(oldMatchReservedLiability);

            // 2.3 Reduce reserved liabilities
            if (match.isSpaceOwned()) {
                if (matchDeltaReservedLiability.isGreaterThan(BetMoney.zero())) {
                    // lock funds
                    spaceAccount.get().lockFunds(matchDeltaReservedLiability);

                    createSpaceTXIForLockOrRelease(
                            CreateSpaceTXIEnum.LOCK,
                            spaceTX,
                            matchDeltaReservedLiability,
                            spaceAccount.get());
                } else if (matchDeltaReservedLiability.isLessThan(BetMoney.zero())) {
                    // release funds
                    spaceAccount.get().releaseFunds(matchDeltaReservedLiability.abs());

                    createSpaceTXIForLockOrRelease(
                            CreateSpaceTXIEnum.RELEASE,
                            spaceTX,
                            matchDeltaReservedLiability,
                            spaceAccount.get());
                }
            }
        }

        if (paramDTO.voidType() == TransactionTypeEnum.MATCH_VOID) {
            match.setStatus(MatchStatusEnum.CANCELLED);
        }
        // 3. publish odd status changed event
        oddSystemEvent.publish(this, new OddSseEvent.OddStatusChanged(
                new OddStatusChangedEventDTO(paramDTO.oddsIds(), OddStatusEnum.VOID)));


        // 4. Reverse TXs (cashback)
        var betSlipItems = betSlipItemRepository.findAllByOddIds(paramDTO.oddsIds());

        var globalEscrowAccount = findGlobalEscrowAccountUC.execute(null);
        Map<String, AccountEntity> userAccountGroupedByUserId = new HashMap<>();
        Map<String, List<TransactionItemEntity>> userGroupedTXItems = new HashMap<>();

        // 4.1 Emitting a new TX to return the stake to the user
        for (var slip : betSlipItems) {
            var slipUser = slip.getCreatedBy();
            var stake = slip.getStake();
            slip.setStatus(BetSlipItemStatusEnum.VOIDED);
            slip.setVoidReason(paramDTO.reason());

            var userAccount = userAccountGroupedByUserId.computeIfAbsent(slipUser.getId(),
                    findAccountByOwnerIdUC::execute);

            var userTXI = new TransactionItemEntity();
            userTXI.generateId();
            userTXI.setAmount(stake);
            userTXI.setType(TransactionItemTypeEnum.STAKE_ESCROW_REFUND);
            userTXI.setFromAccountId(globalEscrowAccount.getId());
            userTXI.setFromAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            userTXI.setToAccountId(userAccount.getId());
            userTXI.setToAccountType(AccountTypeEnum.USER_WALLET);

            userAccount.releaseFunds(stake);
            globalEscrowAccount.debit(stake);
            userGroupedTXItems.computeIfAbsent(slipUser.getId(), k -> new ArrayList<>()).add(userTXI);
        }

        // 4.2 Update bet slip status based on its items
        // (all voided, all lost, all won, etc.)
        var affectedSlips = betSlipItems.stream().map(BetSlipItemEntity::getBetSlip).distinct().toList();
        affectedSlips.forEach(BetSlipEntity::syncStatusFromItems);

        // 5. Create TXs
        this.createTransactionBatches(
                paramDTO.referenceId(),
                paramDTO.referenceType(),
                paramDTO.voidType(),
                paramDTO.reason(),
                paramDTO.referenceName(),
                userGroupedTXItems,
                loggedUser.user());

        // 6. Save space TX
        if (!spaceAccount.isEmpty()) {
            transactionRepository.save(spaceTX);
        }

        return match;
    }

    private MatchEntity validateOdds(List<String> oddIdsToVoid, List<OddEntity> odds) {
        var fetchedOddIds = odds.stream().map(OddEntity::getId).toList();
        List<String> oddsNotFound = new ArrayList<>();

        for (var requestedOddId : oddIdsToVoid) {
            if (!fetchedOddIds.contains(requestedOddId)) {
                oddsNotFound.add(requestedOddId);
            }
        }

        if (!oddsNotFound.isEmpty()) {
            throw new BusinessRuleException("ENTITY_NOT_FOUND", "Some odds were not found",
                    Collections.singletonList(oddsNotFound));
        }

        var match = odds.stream().findFirst().orElseThrow().getCriterion().getMatch();

        for (var o : odds) {
            if (!Objects.equals(match.getId(), o.getCriterion().getMatch().getId())) {
                throw new BusinessRuleException("INVALID_MATCH", "The odds must be from the same match",
                        List.of(o.getId()));
            }

            if (INVALID_ODD_STATUSES.contains(o.getStatus())) {
                throw new BusinessRuleException("INVALID_ODD_STATUS",
                        "The odd has already been voided or settled", List.of(o.getId()));
            }
        }

        return match;
    }

    private <K> void createTransactionBatches(
            String referenceId,
            TransactionReferenceTypeEnum referenceType,
            TransactionTypeEnum voidType, // only allow VOID
            String reason,
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
            tx.setType(voidType);
            tx.setCreatedBy(createdBy);
            tx.setReferenceId(referenceId);
            tx.setReferenceType(referenceType);
            tx.setReferenceName(referenceName);
            tx.setMemo(reason);

            for (var item : txItems) {
                item.setTransaction(tx);
                tx.getItems().add(item);
            }

            transactionRepository.save(tx);
        }
    }
}
