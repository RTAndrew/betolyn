package com.betolyn.features.betting.betslips;


import com.betolyn.features.betting.betslips.dto.BetSlipDTO;
import com.betolyn.features.betting.betslips.dto.BetSlipItemDTO;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchEntity;
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
public interface BetSlipMapper {

    static BetSlipItemDTO toBetSlipItemDTO(BetSlipItemEntity item) {
        var dto = new BetSlipItemDTO();
        dto.setId(item.getId());
        if (item.getCreatedAt() != null) {
            dto.setCreatedAt(item.getCreatedAt().toString());
        }
        if (item.getUpdatedAt() != null) {
            dto.setUpdatedAt(item.getUpdatedAt().toString());
        }
        dto.setStake(MoneyMapper.betMoneyToBigDecimal(item.getStake()));
        dto.setStatus(item.getStatus());
        dto.setVoidReason(item.getVoidReason());
        dto.setPotentialPayout(MoneyMapper.betMoneyToBigDecimal(item.getPotentialPayout()));
        dto.setOddValueAtPlacement(MoneyMapper.oddPriceToBigDecimal(item.getOddValueAtPlacement()));

        if (item.getOddHistory() != null) {
            dto.setLastOddHistoryId(item.getOddHistory().getId());
        }

        if (item.getOdd() != null && item.getOdd().getCriterion() != null) {
            dto.setOddId(item.getOdd().getId());
            dto.setCriterionId(item.getOdd().getCriterion().getId());

            var match = item.getOdd().getCriterion().getMatch();
            if (match != null) {
                dto.setMatchId(match.getId());
                dto.setMatch(toMatchDTO(match));
            }
        }
        return dto;
    }

    static MatchDTO toMatchDTO(MatchEntity match) {
        var dto = new MatchDTO();
        dto.setId(match.getId());
        dto.setType(match.getType());
        if (match.getOfficialMatch() != null) {
            dto.setOfficialMatchId(match.getOfficialMatch().getId());
        }
        dto.setSpaceId(match.getSpaceId());
        dto.setHomeTeam(match.getHomeTeam());
        dto.setHomeTeamScore(match.getHomeTeamScore());
        dto.setAwayTeam(match.getAwayTeam());
        dto.setAwayTeamScore(match.getAwayTeamScore());
        dto.setStartTime(match.getStartTime());
        dto.setEndTime(match.getEndTime());
        dto.setStatus(match.getEffectiveStatus());
        return dto;
    }

    @Named("toBetSlipItemDTOList")
    static List<BetSlipItemDTO> toBetSlipItemDTOList(List<BetSlipItemEntity> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<BetSlipItemDTO> slipItemDTOS = new ArrayList<>();
        for (var item : items) {
            slipItemDTOS.add(toBetSlipItemDTO(item));
        }
        return slipItemDTOS;
    }


    @Mapping(source = "items", target = "items", qualifiedByName = "toBetSlipItemDTOList")
    @Mapping(target = "totalCumulativeOdds", source = "totalCumulativeOdds")
    BetSlipDTO toBetSlipDTO(BetSlipEntity betSlip);
}