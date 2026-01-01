package com.betolyn.features.betting.mapper;

import com.betolyn.features.betting.CriterionEntity;
import com.betolyn.features.betting.dtos.CriterionDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface CriterionMapper {
    CriterionDTO toCriterionDTO(CriterionEntity entity);
    CriterionEntity toCriterionEntity(CriterionDTO criterionDTO);
}
