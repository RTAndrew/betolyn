package com.betolyn.features.betting.betslips.bulkvoidodd;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchVoidedEventDTO;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidMatchUC implements IUseCase<VoidMatchParam, Void> {
    private final FindMatchByIdUC findMatchByIdUC;
    private final MatchSystemEvent matchSystemEvent;
    private final CriterionRepository criterionRepository;
    private final VoidCriterionUC voidCriterionUC;

    @Override
    @Transactional
    public Void execute(VoidMatchParam param) {
        var match = findMatchByIdUC.execute(param.matchId());

        List<String> voidableCriteria = criterionRepository
                .findAllByMatchId(param.matchId(),
                        List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED, CriterionStatusEnum.DRAFT))
                .stream()
                .map(CriterionEntity::getId)
                .toList();

        if (voidableCriteria.isEmpty()) {
            throw new BusinessRuleException("NOTHING_TO_VOID", "No items were found to be voidable");
        }

        for (var criterion : voidableCriteria) {
            voidCriterionUC.execute(new VoidCriterionParam(criterion, param.reason()));
        }

        match.setStatus(MatchStatusEnum.CANCELLED);
        var voidedEventDTO = new MatchVoidedEventDTO(match.getId());
        matchSystemEvent.publish(this, new MatchSseEvent.MatchVoided(voidedEventDTO));

        return null;
    }
}
