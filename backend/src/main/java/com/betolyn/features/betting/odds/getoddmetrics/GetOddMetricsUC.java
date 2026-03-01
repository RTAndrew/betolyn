package com.betolyn.features.betting.odds.getoddmetrics;

import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.betting.odds.dto.OddMetricsDTO;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GetOddMetricsUC {
    private final FindOddByIdUC findOddByIdUC;
    private final OddMapper oddMapper;
    private final BetSlipItemRepository betSlipItemRepository;

    public OddMetricsDTO execute(String oddId) throws EntityNotfoundException {
        OddEntity odd = findOddByIdUC.execute(oddId);
        CriterionEntity criterion = odd.getCriterion();

        double totalCriterionVolume = criterion.getTotalStakesVolume();
        double totalOddVolume = odd.getTotalStakesVolume();
        int totalBetsCount = odd.getTotalBetsCount();

        double marketShare = totalCriterionVolume > 0
                ? (totalOddVolume / totalCriterionVolume) * 100
                : 0.0;

        Double profitAndLosses = criterion.getStatus() == CriterionStatusEnum.SETTLED
                ? computeProfitAndLosses(odd, totalOddVolume)
                : null;

        double averageStake = Objects.requireNonNullElse(
                betSlipItemRepository.averageStakeByOddId(oddId), 0.0);

        OddDTO oddDTO = oddMapper.toOddDTO(odd);

        return OddMetricsDTO.builder()
                .odd(oddDTO)
                .totalCriterionVolume(totalCriterionVolume)
                .totalOddVolume(totalOddVolume)
                .marketShare(marketShare)
                .profitAndLosses(profitAndLosses)
                .averageStake(averageStake)
                .totalBetsCount(totalBetsCount)
                .build();
    }

    private double computeProfitAndLosses(OddEntity odd, double totalOddVolume) {
        if (Boolean.TRUE.equals(odd.getIsWinner())) {
            // Odd-level P/L: stakes on this odd minus payouts to winners on this odd
            return totalOddVolume - (totalOddVolume * odd.getValue());
        }
        return totalOddVolume;
    }
}
