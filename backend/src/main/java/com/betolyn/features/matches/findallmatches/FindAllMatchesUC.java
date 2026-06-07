package com.betolyn.features.matches.findallmatches;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindAllMatchesUC implements IUseCaseNoParams<List<MatchEntity>> {
    private final MatchRepository matchRepository;
    private final OddRepository oddRepository;

    private final List<CriterionStatusEnum> DEFAULT_CRITERIA_STATUS = List.of(
            CriterionStatusEnum.ACTIVE,
            CriterionStatusEnum.SUSPENDED,
            CriterionStatusEnum.DRAFT
    );
    private final Collection<OddStatusEnum> DEFAULT_ODD_STATUS = List.of(
            OddStatusEnum.DRAFT,
            OddStatusEnum.SUSPENDED,
            OddStatusEnum.ACTIVE
    );

    @Override
    @Transactional(readOnly = true)
    public List<MatchEntity> execute() {
        var matches = matchRepository.findAllByMatchType(MatchTypeEnum.OFFICIAL, DEFAULT_CRITERIA_STATUS);
        attachOdds(matches);
        return matches;
    }

    private void attachOdds(List<MatchEntity> matches) {
        var criterionIds = matches.stream()
                .map(MatchEntity::getMainCriterion)
                .filter(Objects::nonNull)
                .map(CriterionEntity::getId)
                .collect(Collectors.toSet());

        if (criterionIds.isEmpty()) {
            return;
        }

        var oddsByCriterionId = oddRepository
                .findAllByCriterionIdInAndStatusIn(criterionIds, DEFAULT_ODD_STATUS)
                .stream()
                .collect(Collectors.groupingBy(odd -> odd.getCriterion().getId()));

        for (var match : matches) {
            var criterion = match.getMainCriterion();
            if (criterion == null) {
                continue;
            }
            criterion.setOdds(oddsByCriterionId.getOrDefault(criterion.getId(), List.of()));
        }
    }
}
