package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(uses = {CriterionMapper.class, OddHistoryMapper.class}, config = BaseMapperConfig.class)
public interface OddMapper {
    @Mapping(source = "criterion.match.id", target = "matchId")
    OddDTO toOddDTO(OddEntity odd);

    @Mapping(target = "value", ignore = true)
    @Mapping(target = "totalStakesVolume", ignore = true)
    @Mapping(target = "potentialPayoutVolume", ignore = true)
    @Mapping(target = "criterion", ignore = true)
    @Mapping(target = "lastOddHistory", ignore = true)
    OddEntity toOddEntity(OddDTO odd);
}
