package com.betolyn.features.matches;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.shared.BaseMapperConfig;
import com.betolyn.shared.MoneyMapper;

@Mapper(config = BaseMapperConfig.class)
@Component
public interface MatchMapper {


    @Named("mainCriterionEntityToMainCriterionDTO")
    public static CriterionDTO mainCriterionEntityToMainCriterionDTO(CriterionEntity criterion) {
        if (criterion == null) {
            return null;
        }

        List<OddDTO> odds = criterion.getOdds().stream().map(odd -> {
            var oddDTO = new OddDTO();
            oddDTO.setId(odd.getId());
            oddDTO.setValue(MoneyMapper.oddPriceToBigDecimal(odd.getValue()));
            oddDTO.setName(odd.getName());
            oddDTO.setStatus(odd.getStatus());
            oddDTO.setTotalStakesVolume(MoneyMapper.betMoneyToBigDecimal(odd.getTotalStakesVolume()));
            oddDTO.setPotentialPayoutVolume(MoneyMapper.betMoneyToBigDecimal(odd.getPotentialPayoutVolume()));
            return oddDTO;
        }).toList();

        var criterionDTO = new CriterionDTO();
        criterionDTO.setOdds(null);
        criterionDTO.setId(criterion.getId());
        criterionDTO.setName(criterion.getName());
        criterionDTO.setMatch(null);
        criterionDTO.setOdds(odds);
        criterionDTO.setStatus(criterion.getStatus());
        criterionDTO.setAllowMultipleOdds(criterion.getAllowMultipleOdds());
        criterionDTO.setIsStandalone(criterion.getIsStandalone());
        criterionDTO.setTotalBetsCount(criterion.getTotalBetsCount());
        criterionDTO.setTotalStakesVolume(MoneyMapper.betMoneyToBigDecimal(criterion.getTotalStakesVolume()));
        criterionDTO.setReservedLiability(MoneyMapper.betMoneyToBigDecimal(criterion.getReservedLiability()));
        criterionDTO.setMaxReservedLiability(MoneyMapper.betMoneyToBigDecimal(criterion.getMaxReservedLiability()));

        return criterionDTO;
    }

    @Mapping(source = "mainCriterion", target = "mainCriterion", qualifiedByName = "mainCriterionEntityToMainCriterionDTO")
    MatchDTO toMatchDTO(MatchEntity entity);

    @Mapping(target = "reservedLiability", ignore = true)
    @Mapping(target = "maxReservedLiability", ignore = true)
    @Mapping(target = "mainCriterion", ignore = true)
    MatchEntity toEntity(MatchDTO entity);
}
