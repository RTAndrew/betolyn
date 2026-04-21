package com.betolyn.features.betting.betslips.bulkvoidodd;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.BettingUtils;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionSseEvent;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.dto.CriterionVoidedEventDTO;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidCriterionUC implements IUseCase<VoidCriterionParam, Void> {
    private final CriterionRepository criterionRepository;
    private final OddRepository oddRepository;
    private final BulkVoidOddUC bulkVoidOddUC;
    private final CriterionSystemEvent criterionSystemEvent;

    @Override
    @Transactional
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

        criterion.setStatus(CriterionStatusEnum.VOID);
        var criterionEventDTO = new CriterionVoidedEventDTO(
                        criterion.getId(),
                        criterion.getMatch().getId(),
                        param.reason(),
                        voidableOddIds);
        criterionSystemEvent.publish(this, new CriterionSseEvent.CriterionVoided(criterionEventDTO));

        return null;
    }
}
