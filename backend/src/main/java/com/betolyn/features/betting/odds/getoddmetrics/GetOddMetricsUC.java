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
import com.betolyn.shared.money.BetMoney;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GetOddMetricsUC {
    private final FindOddByIdUC findOddByIdUC;
    private final OddMapper oddMapper;
    private final BetSlipItemRepository betSlipItemRepository;

    private static double safeRatio(BetMoney numerator, BetMoney denominator) {
        if (denominator == null || denominator.isZero()) {
            return 0.0;
        }
        if (numerator == null || numerator.isZero()) {
            return 0.0;
        }
        return numerator.divide(denominator).doubleValue() * 100;
    }

    public OddMetricsDTO execute(String oddId) throws EntityNotfoundException {
        OddEntity odd = findOddByIdUC.execute(oddId);
        CriterionEntity criterion = odd.getCriterion();

        BetMoney totalCriterionVolume = criterion.getTotalStakesVolume();
        BigDecimal totalOddVolumeBd = betSlipItemRepository.sumStakeByOddIdExcludingVoided(oddId);
        BetMoney totalOddVolume = BetMoney.of(Objects.requireNonNullElse(totalOddVolumeBd, BigDecimal.ZERO));
        int totalBetsCount = odd.getTotalBetsCount();

        double marketShare = safeRatio(totalOddVolume, totalCriterionVolume);

        BigDecimal profitAndLosses = null;
        if (criterion.getStatus() == CriterionStatusEnum.SETTLED) {
            BigDecimal totalPaidToWinners = betSlipItemRepository.sumPotentialPayoutByOddIdWhereWon(oddId);
            if (totalPaidToWinners != null) {
                profitAndLosses = totalOddVolume.subtract(BetMoney.of(totalPaidToWinners)).toBigDecimal();
            }
        }

        BigDecimal averageStake = Objects.requireNonNullElse(
                betSlipItemRepository.averageStakeByOddId(oddId),
                BigDecimal.ZERO
        );

        OddDTO oddDTO = oddMapper.toOddDTO(odd);

        return OddMetricsDTO.builder()
                .odd(oddDTO)
                .totalCriterionVolume(totalCriterionVolume.toBigDecimal())
                .totalOddVolume(totalOddVolume.toBigDecimal())
                .marketShare(marketShare)
                .profitAndLosses(profitAndLosses)
                .averageStake(averageStake)
                .totalBetsCount(totalBetsCount)
                .build();
    }
}
