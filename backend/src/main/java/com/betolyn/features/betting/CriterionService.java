package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateCriterionRequestDTO;
import com.betolyn.features.betting.dtos.CriterionDTO;
import com.betolyn.features.betting.mapper.CriterionMapper;
import com.betolyn.features.matches.MatchService;
import com.betolyn.features.matches.mapper.MatchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriterionService implements ICriterionService{
    private final MatchMapper matchMapper;
    private final MatchService matchService;
    private final CriterionMapper criterionMapper;
    private final CriterionRepository criterionRepository;

    @Override
    public List<CriterionEntity> findAll() {
        return criterionRepository.findAll();
    }

    @Override
    public CriterionDTO findById(String id) {
        var criterion = criterionRepository.findById(id).orElseThrow(() -> new RuntimeException("Entity not found"));

        return criterionMapper.toCriterionDTO(criterion);

    }

    @Override
    public CriterionDTO save(CreateCriterionRequestDTO data) {
        CriterionEntity criterion = new CriterionEntity();
        criterion.setName(data.getName());
        criterion.setAllowMultipleOdds(data.getAllowMultipleOdds());

        if(data.getMatchId() != null) {
            var match = matchService.findById(data.getMatchId());
            criterion.setMatch(matchMapper.toEntity(match));
        }

        var savedCriterion = criterionRepository.save(criterion);
        return criterionMapper.toCriterionDTO(savedCriterion);
    }
}
