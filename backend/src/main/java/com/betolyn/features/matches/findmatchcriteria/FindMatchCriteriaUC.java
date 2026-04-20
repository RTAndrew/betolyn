package com.betolyn.features.matches.findmatchcriteria;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindMatchCriteriaUC implements IUseCase<String, List<CriterionEntity>> {
    private final MatchRepository matchRepository;
    private final CriterionRepository criterionRepository;

    @Override
    public List<CriterionEntity> execute(String matchId) throws EntityNotfoundException {
        return this.execute(matchId, List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED));
    }

    public List<CriterionEntity> execute(String matchId, Collection<CriterionStatusEnum> statuses)
            throws EntityNotfoundException {
        matchRepository.findById(matchId).orElseThrow(EntityNotfoundException::new);
        return criterionRepository.findAllByMatchId(matchId, statuses);
    }
}
