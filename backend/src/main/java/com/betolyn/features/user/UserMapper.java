package com.betolyn.features.user;

import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface UserMapper {
    UserDTO toDTO(UserEntity user);
}
