package com.betolyn.features.matches.findmatchcriteria;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindMatchCriteriaUC implements IUseCase<String, List<CriterionEntity>> {
    private final MatchRepository matchRepository;
    private final CriterionRepository criterionRepository;

    @Override
    public List<CriterionEntity> execute(String matchId) throws EntityNotfoundException {
        matchRepository.findById(matchId).orElseThrow(EntityNotfoundException::new); // TODO: Add a custom exception for criteria not found
        return criterionRepository.findAllByMatchId(matchId, List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED));
    }
}
