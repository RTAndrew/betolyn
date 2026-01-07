package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface OddMapper {
    OddDTO toOddDTO(OddEntity odd);
    OddEntity toOddEntity(OddDTO odd);
}
