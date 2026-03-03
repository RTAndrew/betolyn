package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.shared.BaseMapperConfig;
import com.betolyn.shared.MoneyMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface CriterionMapper {

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
    CriterionDTO toCriterionDTO(CriterionEntity entity);

    @Mapping(target = "totalStakesVolume", ignore = true)
    @Mapping(target = "reservedLiability", ignore = true)
    @Mapping(target = "maxReservedLiability", ignore = true)
    @Mapping(target = "odds", ignore = true)
    @Mapping(target = "match", ignore = true)
    CriterionEntity toCriterionEntity(CriterionDTO criterionDTO);
}
