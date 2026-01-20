package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface OddMapper {
    @Mapping(source = "criterion.odds", target = "criterion.odds", ignore = true)
    @Mapping(source = "criterion.match", target = "criterion.match", ignore = true)
    OddDTO toOddDTO(OddEntity odd);
    OddEntity toOddEntity(OddDTO odd);
}
