package com.betolyn.features.betting.betslips.voiding.voidmatch;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.BettingUtils;
import com.betolyn.features.betting.betslips.voiding.voidcriterion.VoidCriterionParam;
import com.betolyn.features.betting.betslips.voiding.voidcriterion.VoidCriterionUC;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchVoidedEventDTO;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidMatchUC implements IUseCase<VoidMatchParam, Void> {
    private static final List<CriterionStatusEnum> CRITERIA_STATUSES_FOR_VOID = List.of(
            CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED, CriterionStatusEnum.DRAFT);

    private static boolean hasVoidableOdd(CriterionEntity criterion) {
        return criterion.getOdds().stream().anyMatch(BettingUtils::isOddVoidable);
    }
    private final FindMatchByIdUC findMatchByIdUC;
    private final VoidCriterionUC voidCriterionUC;
    private final CriterionRepository criterionRepository;
    private final MatchRepository matchRepository;

    private final MatchSystemEvent matchSystemEvent;

    @Override
    @Transactional
    public Void execute(VoidMatchParam param) {
        var match = findMatchByIdUC.execute(param.matchId());

        List<MatchEntity> matchTargets = new ArrayList<>();
        matchTargets.add(match);

        if (match.getType() == MatchTypeEnum.OFFICIAL) {
            matchTargets.addAll(
                    matchRepository.findByOfficialMatch_IdAndType(match.getId(), MatchTypeEnum.DERIVED));
        }

        var matchIds = matchTargets.stream().map(MatchEntity::getId).toList();
        List<CriterionEntity> criteriaForTargets = criterionRepository.findAllByMatchIds(matchIds,
                CRITERIA_STATUSES_FOR_VOID);
        Map<String, List<CriterionEntity>> criteriaByMatchId = criteriaForTargets.stream()
                .collect(Collectors.groupingBy(c -> c.getMatch().getId()));

        if (criteriaForTargets.stream().noneMatch(VoidMatchUC::hasVoidableOdd)) {
            throw new BusinessRuleException("NOTHING_TO_VOID", "No voidable odds for this match");
        }

        for (var target : matchTargets) {

            List<CriterionEntity> criteriaToVoid = criteriaByMatchId.getOrDefault(target.getId(), List.of()).stream()
                    .filter(VoidMatchUC::hasVoidableOdd)
                    .toList();
            if (criteriaToVoid.isEmpty()) {
                continue;
            }

            for (var criterion : criteriaToVoid) {
                voidCriterionUC.execute(new VoidCriterionParam(criterion.getId(), criterion, param.reason(), true));
            }

            target.setStatus(MatchStatusEnum.CANCELLED);
            matchSystemEvent.publish(this, new MatchSseEvent.MatchVoided(new MatchVoidedEventDTO(target.getId())));
        }

        return null;
    }
}
