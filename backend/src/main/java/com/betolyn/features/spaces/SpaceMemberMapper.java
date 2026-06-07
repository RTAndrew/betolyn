package com.betolyn.features.spaces;

import java.util.List;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import com.betolyn.features.user.UserMapper;
import com.betolyn.shared.BaseMapperConfig;

@Mapper(config = BaseMapperConfig.class, uses = UserMapper.class)
@Component
public interface SpaceMemberMapper {
    SpaceMemberDTO toDTO(SpaceUsersEntity entity);

    List<SpaceMemberDTO> toDTO(List<SpaceUsersEntity> entities);
}
