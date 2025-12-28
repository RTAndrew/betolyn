package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateCriterionRequestDTO;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchService;
import com.betolyn.utils.GenerateId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriterionService implements ICriterionService{
    private final CriterionRepository criterionRepository;
    private final MatchService matchService;

    @Override
    public List<CriterionEntity> findAll() {
        return criterionRepository.findAll();
    }

    @Override
    public CriterionEntity findById(String id) {
        return criterionRepository.findById(id).orElseThrow();
    }

    @Override
    public CriterionEntity save(CreateCriterionRequestDTO data) {
        CriterionEntity criterion = new CriterionEntity();
        criterion.setName(data.getName());
        criterion.setAllowMultipleOdds(data.getAllowMultipleOdds());
        criterion.setId(new GenerateId(12, "crit").generate());

        if(data.getMatchId() != null) {
            MatchEntity match = matchService.findById(data.getMatchId());
            criterion.setMatch(match);
        }

        return criterionRepository.save(criterion);
    }
}
