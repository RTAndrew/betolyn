package com.betolyn.features.betting.mapper;

import com.betolyn.features.betting.OddEntity;
import com.betolyn.features.betting.dtos.OddDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface OddMapper {
    OddDTO toOddDTO(OddEntity odd);
    OddEntity toOddEntity(OddDTO odd);
}
