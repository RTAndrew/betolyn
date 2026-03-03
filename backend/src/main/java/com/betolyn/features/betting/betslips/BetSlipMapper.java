package com.betolyn.features.betting.betslips;


import com.betolyn.features.betting.betslips.dto.BetSlipDTO;
import com.betolyn.features.betting.betslips.dto.BetSlipItemDTO;
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

    @Named("oddEntityToOddDTO")
    public static List<BetSlipItemDTO> oddEntityToOddDTO(List<BetSlipItemEntity> items) {
        if (items == null) {
            return new ArrayList<>();
        }
        List<BetSlipItemDTO> slipItemDTOS = new ArrayList<>();
        for (var item : items) {
            var dto = new BetSlipItemDTO();
            dto.setId(item.getId());
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
                }
            }
            slipItemDTOS.add(dto);
        }
        return slipItemDTOS;
    }


    @Mapping(source = "items", target = "items", qualifiedByName = "oddEntityToOddDTO")
    @Mapping(target = "totalCumulativeOdds", source = "totalCumulativeOdds")
    BetSlipDTO toBetSlipDTO(BetSlipEntity betSlip);
}