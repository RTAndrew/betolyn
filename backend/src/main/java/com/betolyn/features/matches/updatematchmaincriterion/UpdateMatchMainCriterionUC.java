package com.betolyn.features.matches.updatematchmaincriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.exceptions.CriterionDoesNotBelongToMatchException;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateMatchMainCriterionUC implements IUseCase<UpdateMatchMainCriterionParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final CriterionRepository criterionRepository;

    @Override
    @Transactional
    public MatchEntity execute(UpdateMatchMainCriterionParam param) throws MatchNotFoundException {
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);
        var criterion = criterionRepository.findById(param.criterionId())
                .orElseThrow(() -> new EntityNotfoundException("ENTITY_NOT_FOUND", "Criterion not found"));

        if (!criterion.getMatch().getId().equals(param.matchId())) {
            throw new CriterionDoesNotBelongToMatchException();
        }

        match.setMainCriterion(criterion);
        return matchRepository.save(match);
    }
}
