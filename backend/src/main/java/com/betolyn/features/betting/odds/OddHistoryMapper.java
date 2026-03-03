package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.odds.dto.OddHistoryDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(uses = UserMapper.class, config = BaseMapperConfig.class)
public interface OddHistoryMapper {

    @Mapping(target = "name", expression = "java(entity.getOdd() != null ? entity.getOdd().getName() : null)")
    OddHistoryDTO toDTO(OddHistoryEntity entity);
}
