package com.betolyn.features.betting.betslips.voiding.voidcriterion;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.BettingUtils;
import com.betolyn.features.betting.betslips.voiding.bulkvoidodd.BulkVoidOddParam;
import com.betolyn.features.betting.betslips.voiding.bulkvoidodd.BulkVoidOddUC;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionSseEvent;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.dto.CriterionVoidedEventDTO;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidCriterionUC implements IUseCase<VoidCriterionParam, Void> {
    private final CriterionRepository criterionRepository;
    private final BulkVoidOddUC bulkVoidOddUC;
    private final CriterionSystemEvent criterionSystemEvent;

    /**
     * Voids a criterion and all its voidable odds.
     * When {@code isMatchVoid} is {@code true} (e.g. as part of
     * {@link com.betolyn.features.betting.betslips.voiding.voidmatch.VoidMatchUC}), bulk void uses
     * {@link TransactionReferenceTypeEnum#MARKET} and
     * {@link TransactionTypeEnum#MARKET_VOID}.
     * When {@code false} (direct criterion void from the API), bulk void uses
     * {@link TransactionReferenceTypeEnum#MATCH} and
     * {@link TransactionTypeEnum#MATCH_VOID}.
     */
    @Override
    @Transactional
    public Void execute(VoidCriterionParam param) {
        CriterionEntity criterion = Objects.requireNonNullElseGet(param.criterion(),
                () -> criterionRepository.findById(param.criterionId())
                        .orElseThrow(EntityNotfoundException::new));

        List<String> voidableOddsIds = new ArrayList<>();
        List<OddEntity> voidableOdds = new ArrayList<>();
        for (var odd : criterion.getOdds()) {
            if (BettingUtils.isOddVoidable(odd)) {
                voidableOddsIds.add(odd.getId());
                voidableOdds.add(odd);
            }
        }

        if (voidableOdds.isEmpty()) {
            throw new BusinessRuleException("NOTHING_TO_VOID", "No voidable odds for this criterion");
        }

        var bulkVoidOddParam = createBulkVoidOddDTO(criterion, param.reason(),
                voidableOdds, voidableOddsIds, param.isMatchVoid());
        bulkVoidOddUC.execute(bulkVoidOddParam);

        criterion.setStatus(CriterionStatusEnum.VOID);
        var criterionEventDTO = new CriterionVoidedEventDTO(
                criterion.getId(),
                criterion.getMatch().getId(),
                param.reason(),
                voidableOddsIds);
        criterionSystemEvent.publish(this, new CriterionSseEvent.CriterionVoided(criterionEventDTO));

        return null;
    }

    private BulkVoidOddParam createBulkVoidOddDTO(CriterionEntity criterion, String reason, List<OddEntity> odds,
                    List<String> oddsIds,
            boolean isMatchVoid) {

        if (isMatchVoid) {
            return new BulkVoidOddParam(
                    criterion.getMatch().getId(),
                            TransactionReferenceTypeEnum.MATCH,
                    TransactionTypeEnum.MATCH_VOID,
                    reason,
                    criterion.getMatch().getDisplayName(),
                            oddsIds,
                    odds);
        }

        return new BulkVoidOddParam(
                criterion.getId(),
                        TransactionReferenceTypeEnum.MARKET,
                TransactionTypeEnum.MARKET_VOID,
                reason,
                criterion.getName(),
                        oddsIds,
                odds);
    }
}
