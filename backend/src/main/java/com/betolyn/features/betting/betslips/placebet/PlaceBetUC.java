package com.betolyn.features.betting.betslips.placebet;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.account.findglobalescrowaccount.FindGlobalEscrowAccountUC;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipItemEntity;
import com.betolyn.features.betting.betslips.BetSlipMapper;
import com.betolyn.features.betting.betslips.BetSlipRepository;
import com.betolyn.features.betting.betslips.DuplicateOddsInBetSlipException;
import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.features.betting.betslips.dto.BetSlipDTO;
import com.betolyn.features.betting.betslips.enums.BetSlipTypeEnum;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.features.matches.findmatchcriteria.FindMatchCriteriaUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.money.BetMoney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceBetUC implements IUseCase<PlaceBetRequestDTO, PlaceBetUCResponse> {
    public static void throwIfExistsDuplicatedOddsInBetSlip(PlaceBetRequestDTO paramDTO) {
        Set<String> acceptedOddIds = new HashSet<>();
        List<Object> rejectedOdds = new ArrayList<>();
        for (var betItem : paramDTO.getItems()) {
            if (acceptedOddIds.contains(betItem.getOddId())) {
                rejectedOdds.add(betItem.getOddId());
            } else {
                acceptedOddIds.add(betItem.getOddId());
            }
        }

        if (!rejectedOdds.isEmpty()) {
            throw new DuplicateOddsInBetSlipException(rejectedOdds);
        }
    }

    private static BetMoney calculateCriterionReservedLiabilityDelta(CriterionEntity criterion) {
        BetMoney maxLiability = BetMoney.zero();
        for (var criterionOdd : criterion.getOdds()) {
            // marketLiability = odd.potentialPayoutVolume - criterion.totalStakesVolume
            // if marketLiability < 0, then liability = 0 (profit for the house)

            BetMoney liability = criterionOdd.getPotentialPayoutVolume().subtract(criterion.getTotalStakesVolume());
            if (liability.isLessThan(BetMoney.zero())) {
                liability = BetMoney.zero();
            }
            if (liability.isGreaterThan(maxLiability)) {
                maxLiability = liability;
            }
        }
        return maxLiability;
    }

    private static BetMoney calculateMatchReservedLiability(List<CriterionEntity> matchCriteria,
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

    private final FindOddByIdUC findOddByIdUC;
    private final FindGlobalEscrowAccountUC findGlobalEscrowAccountUC;
    private final TransactionRepository transactionRepository;
    private final BetSlipRepository betSlipRepository;
    private final CriterionRepository criterionRepository;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;
    private final FindMatchCriteriaUC findMatchCriteriaUC;
    private final BetSlipMapper betSlipMapper;

    @SuppressWarnings("D")
    @Override
    @Transactional
    public PlaceBetUCResponse execute(@Validated PlaceBetRequestDTO paramDTO) {
        throwIfExistsDuplicatedOddsInBetSlip(paramDTO);
        if (paramDTO.getItems().isEmpty()) {
            throw new BadRequestException("NO_VALID_BETS", "An unexpected error happened. No valid bets were found");
        }

        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var userAccount = findAccountByOwnerIdUC.execute(loggedUser.getId());
        var globalEscrowAccount = findGlobalEscrowAccountUC.execute(null);

        var betSlip = new BetSlipEntity();
        betSlip.generateId();

        // prepare TX
        var transaction = new TransactionEntity();
        transaction.setCreatedBy(loggedUser);
        transaction.setType(TransactionTypeEnum.BET_PLACEMENT);
        transaction.setReferenceId(betSlip.getId());
        transaction.setReferenceType(TransactionReferenceTypeEnum.BET_SLIP);

        Map<String, AccountEntity> spaceAccountsBySpaceId = new HashMap<>();

        List<OddAccepted> oddList = new ArrayList<>();
        List<OddRejected> oddRejectedList = new ArrayList<>();

        // 1. Check if bets are valid
        for (var betItem : paramDTO.getItems()) {
            // dismantle the assertions into smaller ones,
            // and perhaps emitEvents so the frontend can update immediately,
            // in case it did not receive yet (e.g: match terminated...)
            var odd = findOddByIdUC.execute(betItem.getOddId());

            // perhaps allow the user to opt for new odd price changes?!
            if (betItem.getOddValueAtPlacement().compareTo(odd.getValue().toBigDecimal()) < 0) {
                oddRejectedList.add(
                        new OddRejected(odd.getId(), odd.getCriterion().getMatch().getId(), "Odd value changed"));
            } else if (odd.getStatus() != OddStatusEnum.ACTIVE
                    || odd.getCriterion().getStatus() != CriterionStatusEnum.ACTIVE) {
                oddRejectedList.add(
                        new OddRejected(odd.getId(), odd.getCriterion().getMatch().getId(),
                                "No longer available to bet"));
            } else {
                // since the price is now higher or equal than the realOdd.value
                // the bet placement must be set to the realOdd.value
                // Because it is still favorable to the user to bet at lower price
                betItem.setOddValueAtPlacement(odd.getValue().toBigDecimal());
                oddList.add(
                        new OddAccepted(betItem, odd));
            }
        }

        // 2. All odds in PARLAY must be valid
        if (paramDTO.getType() == BetSlipTypeEnum.PARLAY) {
            if (!oddRejectedList.isEmpty()) {
                throw new RejectedBetsException("INVALID_ODDS", "Invalid odds",
                        Collections.singletonList(oddRejectedList));
            }

            throw new BusinessRuleException("FEAT_NOT_IMPLEMENTED", "Feature not yet implemented");
        }

        if (oddList.isEmpty()) {
            if (!oddRejectedList.isEmpty()) {
                throw new RejectedBetsException("INVALID_ODDS", "Invalid odds",
                        Collections.singletonList(oddRejectedList));
            }
            throw new BadRequestException("NO_VALID_BETS", "An unexpected error happened. No valid bets were found");
        }

        // 3. Criterion and Odd projection recalculation
        for (var odd : oddList) {
            var betOdd = odd.betItem();
            BetMoney stakeMoney = BetMoney.of(betOdd.getStake());
            BetMoney betOddPayout = stakeMoney.multiply(betOdd.getOddValueAtPlacement());

            // 3.2 Update odd projection
            var realOdd = odd.odd();
            realOdd.setTotalBetsCount(realOdd.getTotalBetsCount() + 1);
            realOdd.setTotalStakesVolume(realOdd.getTotalStakesVolume().add(stakeMoney));
            realOdd.setPotentialPayoutVolume(realOdd.getPotentialPayoutVolume().add(betOddPayout));

            // 3.3 Update criterion projection
            var criterion = realOdd.getCriterion();
            criterion.setTotalBetsCount(criterion.getTotalBetsCount() + 1);
            criterion.setTotalStakesVolume(criterion.getTotalStakesVolume().add(stakeMoney));

            // 3.4 recalculate market liability for each criterion.odds
            var newCriterionReservedLiability = calculateCriterionReservedLiabilityDelta(criterion);
            criterion.setReservedLiability(newCriterionReservedLiability);

            // 3.5 recalculate match projections
            // TODO: for standalone criterion, there will be no match associated with it
            var matchCriteria = findMatchCriteriaUC.execute(criterion.getMatch().getId());
            var oldMatchReservedLiability = criterion.getMatch().getReservedLiability();
            var newMatchReservedLiability = calculateMatchReservedLiability(
                    matchCriteria,
                    criterion,
                    newCriterionReservedLiability);
            var matchDeltaReservedLiability = newMatchReservedLiability.subtract(oldMatchReservedLiability);

            if (criterion.getMaxReservedLiability() != null
                    && newCriterionReservedLiability.isGreaterThan(criterion.getMaxReservedLiability())) {
                throw new BusinessRuleException("CRITERION_INSUFFICIENT_LIQUIDITY",
                        "Criterion does not have sufficient liquidity");
            }

            // TODO: suspend match if it has insufficient liquidity
            if (criterion.getMatch().getMaxReservedLiability() != null
                    && newMatchReservedLiability.isGreaterThan(criterion.getMatch().getMaxReservedLiability())) {
                throw new BusinessRuleException("MATCH_INSUFFICIENT_LIQUIDITY",
                        "Match does not have sufficient liquidity");
            }

            // TODO: check if space has enough balance to cover the liability
            // if (channel.available_balance < new_net_liability_delta) {
            // throw new Error("CHANNEL_INSUFFICIENT_LIQUIDITY");
            // }

            criterion.getMatch().setReservedLiability(newMatchReservedLiability);

            // 5. Lock user funds
            userAccount.lockFunds(stakeMoney);
            var userLockFundsTXI = new TransactionItemEntity();
            userLockFundsTXI.setTransaction(transaction);
            userLockFundsTXI.setAmount(stakeMoney);
            userLockFundsTXI.setFromAccountType(AccountTypeEnum.USER_WALLET);
            userLockFundsTXI.setFromAccountId(userAccount.getId());

            // 5.1 Lock or Release SPACE funds
            // Check if the match is space-owned (unofficial)
            if (criterion.getMatch().isSpaceOwned()) {
                var spaceId = criterion.getMatch().getSpaceId();
                var spaceAccount = spaceAccountsBySpaceId.computeIfAbsent(spaceId, findAccountByOwnerIdUC::execute);
                userLockFundsTXI.setToAccountType(AccountTypeEnum.SPACE_RESERVED);
                userLockFundsTXI.setToAccountId(spaceAccount.getId());

                if (matchDeltaReservedLiability.isGreaterThan(BetMoney.zero())) {
                    // lock funds
                    spaceAccount.lockFunds(matchDeltaReservedLiability);
                } else if (matchDeltaReservedLiability.isLessThan(BetMoney.zero())) {
                    // release funds
                    spaceAccount.releaseFunds(matchDeltaReservedLiability.abs());
                }
            }

            // 5.2 Increase GLOBAL ESCROW funds (player money being held by the platform)
            globalEscrowAccount.credit(stakeMoney); // we are not setting the liability aside
            userLockFundsTXI.setToAccountType(AccountTypeEnum.GLOBAL_ESCROW);
            userLockFundsTXI.setToAccountId(globalEscrowAccount.getId());

            transaction.getItems().add(userLockFundsTXI);

            // 6. create betSlipItem
            var betSlipItem = new BetSlipItemEntity();
            betSlipItem.setBetSlip(betSlip);
            betSlipItem.setCriterionId(realOdd.getCriterion().getId());
            betSlipItem.setMatchId(realOdd.getCriterion().getMatch().getId());
            betSlipItem.setOdd(realOdd);
            betSlipItem.setStake(stakeMoney);
            betSlipItem.setPotentialPayout(betOddPayout);
            betSlipItem.setOddHistory(realOdd.getLastOddHistory());
            betSlipItem.setOddValueAtPlacement(new OddPrice(betOdd.getOddValueAtPlacement()));
            betSlip.getItems().add(betSlipItem);

            criterionRepository.save(criterion);
        }

        // 7. Update betSlip projections
        betSlip.updateProjections();

        // 8. save
        var bet = betSlipRepository.save(betSlip);
        transactionRepository.save(transaction);

        var betDTO = betSlipMapper.toBetSlipDTO(bet);
        return new PlaceBetUCResponse(betDTO, oddRejectedList);
    }
}

record OddRejected(String oddId, String matchId, String rejectionReason) {
}

record OddAccepted(PlaceBetItemParam betItem, OddEntity odd) {
}

record PlaceBetUCResponse(BetSlipDTO bet, List<OddRejected> rejectedOdds) {
}
