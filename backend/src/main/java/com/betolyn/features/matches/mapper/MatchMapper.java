package com.betolyn.features.matches.mapper;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.List;

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
            oddDTO.setValue(odd.getValue());
            oddDTO.setName(odd.getName());
            oddDTO.setStatus(odd.getStatus());
            return oddDTO;
        }).toList();

        var criterionDTO = new CriterionDTO();
        criterionDTO.setOdds(null);
        criterionDTO.setId(criterion.getId());
        criterionDTO.setName(criterion.getName());
        criterionDTO.setMatch(null);
        criterionDTO.setOdds(odds);
        criterionDTO.setAllowMultipleOdds(criterion.getAllowMultipleOdds());
        criterionDTO.setIsStandalone(criterionDTO.getIsStandalone());

        return criterionDTO;
    }

    @Mapping(source = "mainCriterion", target = "mainCriterion", qualifiedByName = "mainCriterionEntityToMainCriterionDTO")
    MatchDTO toMatchDTO(MatchEntity entity);

    MatchEntity toEntity(MatchDTO entity);
}
