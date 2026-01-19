package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.bettingSystemEvents.BettingSystemEvent;
import com.betolyn.features.betting.criterion.dto.CreateCriterionRequestDTO;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.dto.UpdateCriterionOddsRequestDTO;
import com.betolyn.features.betting.criterion.dto.UpdateCriterionRequestDTO;
import com.betolyn.features.betting.criterion.exceptions.CriterionCannotUpdateToDraftException;
import com.betolyn.features.betting.criterion.exceptions.MultipleOddsIsNotAllowedException;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddService;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.MatchService;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CriterionService implements ICriterionService {
    private final MatchService matchService;
    private final CriterionMapper criterionMapper;
    private final CriterionRepository criterionRepository;
    private final OddService oddService;
    private final BettingSystemEvent bettingSystemEvent;

    @Override
    public List<CriterionEntity> findAll() {
        return criterionRepository.findByStatusIn(
                List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED)
        );
    }

    @Override
    public CriterionEntity findById(String id) {
        var criterion = criterionRepository.findById(id).orElseThrow(EntityNotfoundException::new);
        return criterion;
    }

    public List<CriterionEntity> findAllByMatchId(String matchId) {
        return criterionRepository.findAllByMatchId(matchId, List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED));
    }

    @Transactional
    public CriterionEntity update(String criterionId, UpdateCriterionRequestDTO requestDTO) {
        var foundCriterion = this.findById(criterionId);

        if (requestDTO.getStatus() == CriterionStatusEnum.DRAFT) {
            throw new CriterionCannotUpdateToDraftException();
        }

        foundCriterion.setStatus(requestDTO.getStatus());
        var savedCriterion = criterionRepository.save(foundCriterion);
        bettingSystemEvent.publishCriterionUpdate(this, savedCriterion);
        return savedCriterion;
    }

    @Override
    @Transactional
    public CriterionDTO save(CreateCriterionRequestDTO data) {

        CriterionEntity criterion = new CriterionEntity();
        criterion.setName(data.getName());

        if (data.getStatus() == null) {
            criterion.setStatus(CriterionStatusEnum.DRAFT);
        } else {
            criterion.setStatus(data.getStatus());
        }
        criterion.setAllowMultipleOdds(data.getAllowMultipleOdds());

        if (!data.getAllowMultipleOdds() && data.getOdds().size() > 1) {
            throw new MultipleOddsIsNotAllowedException();
        }

        if (data.getMatchId() != null) {
            var match = matchService.findById(data.getMatchId());
            criterion.setMatch(match);
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
            tempOdd.setCriterion(savedCriterion);
            tempOdd.setStatus(OddStatusEnum.ACTIVE);

            return tempOdd;
        }).toList();

        oddService.save(oddList);

        return criterionMapper.toCriterionDTO(savedCriterion);
    }

    @Transactional
    public CriterionEntity updateOdds(String criterionId, UpdateCriterionOddsRequestDTO requestDTO) {
        var criterion = this.findById(criterionId);

        List<OddEntity> odds = requestDTO.getOdds().stream().map(odd -> {
            var status = OddStatusEnum.ACTIVE;
            if (odd.status() != null) {
                status = odd.status();
            }

            var foundOddFromCriterion = criterion.getOdds().stream().filter((o) -> Objects.equals(o.getId(), odd.id())).findFirst();
            var tempOdd = new OddEntity();
            foundOddFromCriterion.ifPresent(oddDTO -> tempOdd.setName(oddDTO.getName()));

            tempOdd.setCriterion(criterion);
            tempOdd.setStatus(status);
            tempOdd.setValue(odd.value());
            tempOdd.setId(odd.id());


            return tempOdd;
        }).toList();

        oddService.update(odds);
        return this.findById(criterionId);
    }
}
