package com.betolyn.features.betting.criterion;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.matches.MatchDtoAssembler;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.shared.BaseMapperConfig;
import com.betolyn.shared.MoneyMapper;

@Mapper(config = BaseMapperConfig.class, injectionStrategy = InjectionStrategy.FIELD)
public abstract class CriterionMapper {

    @Autowired
    protected MatchDtoAssembler matchDtoAssembler;

    @Named("listOddEntityToListOddDTO")
    public static List<OddDTO> toListDTO(List<OddEntity> odds) {
        var oddsDTO = new ArrayList<OddDTO>();
        if (odds == null) {
            return oddsDTO;
        }

        for (var odd : odds) {
            var dto = new OddDTO();
            dto.setValue(MoneyMapper.oddPriceToBigDecimal(odd.getValue()));
            dto.setStatus(odd.getStatus());
            dto.setName(odd.getName());
            dto.setId(odd.getId());
            dto.setIsWinner(odd.getIsWinner());
            dto.setTotalStakesVolume(MoneyMapper.betMoneyToBigDecimal(odd.getTotalStakesVolume()));
            dto.setPotentialPayoutVolume(MoneyMapper.betMoneyToBigDecimal(odd.getPotentialPayoutVolume()));
            oddsDTO.add(dto);
        }

        return oddsDTO;
    }

    @Mapping(source = "odds", target = "odds", qualifiedByName = "listOddEntityToListOddDTO")
    @Mapping(source = "match.mainCriterion", target = "match.mainCriterion", ignore = true)
    public abstract CriterionDTO toCriterionDTO(CriterionEntity entity);

    @AfterMapping
    protected void mergeDerivedMatchIntoCriterionDto(@MappingTarget CriterionDTO dto, CriterionEntity entity) {
        if (entity.getMatch() == null) {
            return;
        }
        if (entity.getMatch().getType() != MatchTypeEnum.DERIVED) {
            return;
        }
        // Derived rows have no home/away teams on the entity; expose feed-backed fixture like GET /matches/{id}.
        // stripMarkets: avoid duplicating mainCriterion under match (parent payload is already this criterion).
        dto.setMatch(matchDtoAssembler.forNestedUnderCriterion(entity.getMatch()));
    }

    @Mapping(target = "totalStakesVolume", ignore = true)
    @Mapping(target = "reservedLiability", ignore = true)
    @Mapping(target = "maxReservedLiability", ignore = true)
    @Mapping(target = "odds", ignore = true)
    @Mapping(target = "match", ignore = true)
    public abstract CriterionEntity toCriterionEntity(CriterionDTO criterionDTO);
}
