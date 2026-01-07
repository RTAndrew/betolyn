package com.betolyn.features.betting.criterion;
import com.betolyn.features.betting.criterion.dto.CreateCriterionRequestDTO;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.*;
import com.betolyn.features.matches.MatchService;
import com.betolyn.features.matches.mapper.MatchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriterionService implements ICriterionService {
    private final MatchMapper matchMapper;
    private final MatchService matchService;
    private final CriterionMapper criterionMapper;
    private final CriterionRepository criterionRepository;
    private final OddService oddService;

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
    @Transactional
    public CriterionDTO save(CreateCriterionRequestDTO data) {
        CriterionEntity criterion = new CriterionEntity();
        criterion.setName(data.getName());
        criterion.setAllowMultipleOdds(data.getAllowMultipleOdds());

        if (!data.getAllowMultipleOdds() && data.getOdds().size() > 1) {
            throw new MultipleOddsIsNotAllowedException();
        }

        if (data.getMatchId() != null) {
            var match = matchService.findById(data.getMatchId());
            criterion.setMatch(matchMapper.toEntity(match));
        }

        var savedCriterion = criterionRepository.saveAndFlush(criterion);
        if (data.getOdds().isEmpty()) {
            // no need to save the odds
            return criterionMapper.toCriterionDTO(savedCriterion);
        }

        List<OddEntity> oddList = data.getOdds().stream().map(odd -> {
            var tempOdd = new OddEntity();
            tempOdd.setName(odd.getName());
            tempOdd.setValue(odd.getValue());
            tempOdd.setMinimumAmount(odd.getMinimumAmount());
            tempOdd.setMaximumAmount(odd.getMaximumAmount());
            tempOdd.setCriterion(savedCriterion);
            tempOdd.setStatus(OddStatusEnum.ACTIVE);

            return tempOdd;
        }).toList();

        oddService.save(oddList);

        return criterionMapper.toCriterionDTO(savedCriterion);
    }
}
