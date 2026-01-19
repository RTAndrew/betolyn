package com.betolyn.features.matches.mapper;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.features.matches.dto.UpdateMatchRequestDTO;
import com.betolyn.shared.BaseMapperConfig;
import jakarta.validation.constraints.Null;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

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


    // Or do this only once at the Mapper level, but having it affecting other mappers.
    // moving to VSA would be more isolated
    @Mapping(source = "status", target = "status", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "homeTeamScore", target = "homeTeamScore", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "awayTeamScore", target = "awayTeamScore", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "startTime", target = "startTime", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "endTime", target = "endTime", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    MatchEntity toEntity (UpdateMatchRequestDTO requestDTO,@MappingTarget MatchEntity entity);
}
