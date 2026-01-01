package com.betolyn.features.matches.mapper;

import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(config = BaseMapperConfig.class)
@Component
public interface MatchMapper {
    MatchDTO toMatchDTO(MatchEntity entity);
    MatchEntity toEntity(MatchDTO entity);
}
