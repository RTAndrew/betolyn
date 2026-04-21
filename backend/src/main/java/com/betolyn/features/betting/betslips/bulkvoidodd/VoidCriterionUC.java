package com.betolyn.features.betting.betslips.bulkvoidodd;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.BettingUtils;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidCriterionUC implements IUseCase<VoidCriterionParam, Void> {
    private final CriterionRepository criterionRepository;
    private final OddRepository oddRepository;
    private final BulkVoidOddUC bulkVoidOddUC;

    @Override
    public Void execute(VoidCriterionParam param) {
        var criterion = criterionRepository.findById(param.criterionId())
                .orElseThrow(EntityNotfoundException::new);

        List<String> voidableOddIds = oddRepository.findAllByCriterionId(param.criterionId()).stream()
                .filter(BettingUtils::isOddVoidable)
                .map(OddEntity::getId)
                .toList();

        if (voidableOddIds.isEmpty()) {
            throw new BusinessRuleException("NOTHING_TO_VOID", "No voidable odds for this criterion");
        }

        bulkVoidOddUC.execute(new BulkVoidOddParam(
                param.criterionId(),
                TransactionReferenceTypeEnum.MARKET,
                TransactionTypeEnum.MARKET_VOID,
                param.reason(),
                criterion.getName(),
                voidableOddIds));

        return null;
    }
}
