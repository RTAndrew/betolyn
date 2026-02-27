package com.betolyn.features.betting.criterion.suspendcriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.updatecriterionstatus.CriterionStatusChangedEventDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuspendBulkCriterionUC implements IUseCase<String, List<CriterionEntity>> {
    private final CriterionRepository criterionRepository;
    private final CriterionSystemEvent criterionSystemEvent;

    @Override
    @Transactional
    public List<CriterionEntity> execute(String matchId) {
        var criteria = criterionRepository.findAllByMatchId(
                matchId,
                List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.DRAFT)
        );

        for (var criterion : criteria) {
            if (criterion.getStatus() == CriterionStatusEnum.SUSPENDED) {
                continue;
            }

            criterion.setStatus(CriterionStatusEnum.SUSPENDED);
            var savedCriterion = criterionRepository.save(criterion);

            var eventDTO = new CriterionStatusChangedEventDTO(
                    savedCriterion.getId(),
                    savedCriterion.getMatch().getId(),
                    savedCriterion.getStatus(),
                    List.of()
            );

            criterionSystemEvent.publish(this, "criterionSuspended", eventDTO);
        }

        return criteria;
    }
}

