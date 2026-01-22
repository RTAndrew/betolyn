package com.betolyn.features.betting.criterion.findallcriteria;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindAllCriteriaUC implements IUseCaseNoParams<List<CriterionEntity>> {
    private final CriterionRepository criterionRepository;

    @Override
    public List<CriterionEntity> execute() {
        return criterionRepository.findByStatusIn(
                List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.SUSPENDED)
        );
    }
}
