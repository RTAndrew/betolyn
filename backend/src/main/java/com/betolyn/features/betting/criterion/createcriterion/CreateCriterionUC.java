package com.betolyn.features.betting.criterion.createcriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.*;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.exceptions.MultipleOddsIsNotAllowedException;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.bulksaveodds.BulkSaveOddsUC;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateCriterionUC implements IUseCase<CreateCriterionRequestDTO, CriterionDTO> {
    private final FindMatchByIdUC findMatchByIdUC;
    private final CriterionMapper criterionMapper;
    private final CriterionRepository criterionRepository;
    private final BulkSaveOddsUC bulkSaveOddsUC;
    private final CriterionSystemEvent criterionSystemEvent;

    @Override
    @Transactional
    public CriterionDTO execute(CreateCriterionRequestDTO data) {
        CriterionEntity criterion = new CriterionEntity();
        criterion.setAllowMultipleOdds(data.getAllowMultipleOdds());
        criterion.setName(data.getName());

        if (data.getStatus() == null) {
            criterion.setStatus(CriterionStatusEnum.DRAFT);
        } else {
            criterion.setStatus(data.getStatus());
        }

        if (!data.getAllowMultipleOdds() && data.getOdds().size() > 1) {
            throw new MultipleOddsIsNotAllowedException();
        }

        if (data.getMatchId() != null) {
            var match = findMatchByIdUC.execute(data.getMatchId());
            criterion.setMatch(match);
        }

        var savedCriterion = criterionRepository.saveAndFlush(criterion);
        if (data.getOdds().isEmpty()) {
            return criterionMapper.toCriterionDTO(savedCriterion);
        }

        List<OddEntity> oddList = data.getOdds().stream().map(odd -> {
            var tempOdd = new OddEntity();
            tempOdd.setName(odd.getName());
            tempOdd.setValue(odd.getValue());
            tempOdd.setCriterion(savedCriterion);
            tempOdd.setStatus(odd.getStatus() != null ? odd.getStatus() : OddStatusEnum.DRAFT);

            return tempOdd;
        }).toList();

        bulkSaveOddsUC.execute(oddList);
        var criterionDTO = criterionMapper.toCriterionDTO(savedCriterion);
        criterionSystemEvent.publish(this, "criterionCreated", criterionDTO);

        return criterionDTO;
    }
}
