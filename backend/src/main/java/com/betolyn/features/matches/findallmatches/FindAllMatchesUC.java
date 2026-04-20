package com.betolyn.features.matches.findallmatches;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindAllMatchesUC implements IUseCaseNoParams<List<MatchEntity>> {
    private final MatchRepository matchRepository;

    private final List<CriterionStatusEnum> DEFAULT_CRITERIA_STATUS = (List.of(new CriterionStatusEnum[]{CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED, CriterionStatusEnum.DRAFT}));
    private final Collection<OddStatusEnum> DEFAULT_ODD_STATUS = List.of(OddStatusEnum.DRAFT, OddStatusEnum.SUSPENDED, OddStatusEnum.ACTIVE);

    @Override
    public List<MatchEntity> execute() {
        return matchRepository.findAllByMatchType(MatchTypeEnum.OFFICIAL, DEFAULT_CRITERIA_STATUS, DEFAULT_ODD_STATUS);
    }
}
