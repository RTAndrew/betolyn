package com.betolyn.features.betting.criterion.updatecriterionstatus;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.features.betting.odds.*;
import com.betolyn.shared.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UpdateCriterionStatusUC implements IUseCase<UpdateCriterionStatusParam, CriterionEntity> {
    private static final Set<CriterionStatusEnum> ALLOWED_STATUSES = Set.of(
            CriterionStatusEnum.EXPIRED,
            CriterionStatusEnum.ACTIVE, // TODO: remove this from here, and perhaps create a /cancel for voiding
            CriterionStatusEnum.VOID);

    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionRepository criterionRepository;
    private final CriterionSystemEvent criterionSystemEvent;
    private final OddRepository oddRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public CriterionEntity execute(UpdateCriterionStatusParam param) {
        var foundCriterion = findCriterionByIdUC.execute(param.criterionId());

        var newStatus = param.requestDTO().getStatus();
        var oddStatus = OddStatusEnum.valueOf(newStatus.name());

        if (!ALLOWED_STATUSES.contains(newStatus)) {
            throw new BadRequestException("INVALID_CRITERION_STATUS", "Invalid status");
        }

        foundCriterion.setStatus(newStatus);
        var savedCriterion = criterionRepository.save(foundCriterion);

        var odds = oddRepository.findAllByCriterionId(param.criterionId());

        odds.forEach(o -> o.setStatus(oddStatus));
        if (!odds.isEmpty()) {
            saveAndSyncOddUseCase.execute(odds);
        }

        var affectedOddIds = odds.stream().map(o -> o.getId()).toList();
        var criterionEventDTO = new CriterionStatusChangedEventDTO(
                savedCriterion.getId(),
                savedCriterion.getMatch().getId(),
                savedCriterion.getStatus(),
                affectedOddIds
        );

        criterionSystemEvent.publish(this, "criterionStatusChanged", criterionEventDTO);
        if (!odds.isEmpty()) {
            oddSystemEvent.publish(this, "oddStatusChanged", new OddStatusChangedEventDTO(affectedOddIds, oddStatus));
        }

        return savedCriterion;
    }
}
