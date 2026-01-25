package com.betolyn.features.betting.criterion.suspendcriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.features.betting.criterion.updatecriterionstatus.CriterionStatusChangedEventDTO;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.betting.odds.OddStatusChangedEventDTO;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
import com.betolyn.shared.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SuspendCriterionUC implements IUseCase<String, CriterionEntity> {
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionRepository criterionRepository;
    private final OddRepository oddRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final CriterionSystemEvent criterionSystemEvent;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public CriterionEntity execute(String criterionId) {
        var foundCriterion = findCriterionByIdUC.execute(criterionId);
        if (foundCriterion.getStatus() == CriterionStatusEnum.SUSPENDED) {
            throw new BusinessRuleException("ALREADY_SUSPENDED", "Criterion is already suspended");
        }
        foundCriterion.setStatus(CriterionStatusEnum.SUSPENDED);
        var savedCriterion = criterionRepository.save(foundCriterion);

        var odds = oddRepository.findAllByCriterionId(criterionId);
        var active = odds.stream().filter(o -> o.getStatus() == OddStatusEnum.ACTIVE).toList();
        active.forEach(o -> o.setStatus(OddStatusEnum.SUSPENDED));
        if (!active.isEmpty()) {
            saveAndSyncOddUseCase.execute(active);
        }

        var affectedOddIds = active.stream().map(o -> o.getId()).toList();
        var eventDTO = new CriterionStatusChangedEventDTO(
                savedCriterion.getId(),
                savedCriterion.getMatch().getId(),
                savedCriterion.getStatus(),
                affectedOddIds
        );
        criterionSystemEvent.publish(this, "criterionSuspended", eventDTO);
        if (!active.isEmpty()) {
            oddSystemEvent.publish(this, "oddStatusChanged", new OddStatusChangedEventDTO(affectedOddIds, OddStatusEnum.SUSPENDED));
        }

        return savedCriterion;
    }
}
