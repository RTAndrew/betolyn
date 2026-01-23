package com.betolyn.features.betting.criterion.updatecriterionstatus;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.shared.exceptions.BadRequestException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UpdateCriterionStatusUC implements IUseCase<UpdateCriterionStatusParam, CriterionEntity> {
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionRepository criterionRepository;
    private final CriterionSystemEvent criterionSystemEvent;

    private static final Set<CriterionStatusEnum> ALLOWED_STATUSES = Set.of(
            CriterionStatusEnum.EXPIRED,
            CriterionStatusEnum.ACTIVE,
            CriterionStatusEnum.SUSPENDED,
            CriterionStatusEnum.VOID);

    @Override
    @Transactional
    public CriterionEntity execute(UpdateCriterionStatusParam param) {
        var foundCriterion = findCriterionByIdUC.execute(param.criterionId());
        var newStatus = param.requestDTO().getStatus();

        if (!ALLOWED_STATUSES.contains(newStatus)) {
            throw new BadRequestException("INVALID_CRITERION_STATUS", "Invalid status");
        }

        foundCriterion.setStatus(newStatus);
        var savedCriterion = criterionRepository.save(foundCriterion);

        var eventDTO = new CriterionStatusChangedEventDTO(savedCriterion.getId(), savedCriterion.getStatus());
        criterionSystemEvent.publish(this, "criterionStatusChanged", eventDTO);

        return savedCriterion;
    }
}
