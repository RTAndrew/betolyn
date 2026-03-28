package com.betolyn.features.spaces;

import org.springframework.stereotype.Component;

import com.betolyn.features.matches.MatchMapper;
import com.betolyn.shared.MoneyMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SpaceMatchMapper {
    private final MatchMapper matchMapper;

    public SpaceMatchDTO toDTO(SpaceMatchEntity entity) {
        var dto = new SpaceMatchDTO();
        dto.setId(entity.getId());
        dto.setSpaceId(entity.getSpace().getId());
        dto.setMatchId(entity.getMatch().getId());
        dto.setMatch(matchMapper.toMatchDTO(entity.getMatch()));
        dto.setReservedLiability(MoneyMapper.betMoneyToBigDecimal(entity.getReservedLiability()));
        dto.setMaxReservedLiability(MoneyMapper.betMoneyToBigDecimal(entity.getMaxReservedLiability()));
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
