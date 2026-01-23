package com.betolyn.features.betting.criterion.publishcriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PublishCriterionUC implements IUseCase<String, CriterionEntity> {
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionRepository criterionRepository;
    private final CriterionSystemEvent criterionSystemEvent;


    @Override
    @Transactional
    public CriterionEntity execute(String criterionId) {
        var foundCriterion = findCriterionByIdUC.execute(criterionId);
        
        foundCriterion.setStatus(CriterionStatusEnum.ACTIVE);
        var savedCriterion = criterionRepository.save(foundCriterion);

        var eventDTO = new PublishCriterionEventDTO(savedCriterion.getId(), savedCriterion.getStatus());
        criterionSystemEvent.publish(this, "criterionPublished", eventDTO);
        
        return savedCriterion;
    }
}
