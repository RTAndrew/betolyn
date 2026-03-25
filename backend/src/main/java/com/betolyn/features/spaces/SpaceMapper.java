package com.betolyn.features.spaces;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import com.betolyn.features.user.UserMapper;
import com.betolyn.shared.BaseMapperConfig;

@Mapper(config = BaseMapperConfig.class, uses = UserMapper.class)
@Component
public interface SpaceMapper {
    SpaceDTO toDTO(SpaceEntity entity);
}
