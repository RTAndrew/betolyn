package com.betolyn.features.betting.criterion.findcriterionbyid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindCriterionByIdUC implements IUseCase<String, CriterionEntity> {
    private final CriterionRepository criterionRepository;

    @Override
    public CriterionEntity execute(String criterionId) throws EntityNotfoundException {
        return criterionRepository.findById(criterionId).orElseThrow(EntityNotfoundException::new);
    }
}
