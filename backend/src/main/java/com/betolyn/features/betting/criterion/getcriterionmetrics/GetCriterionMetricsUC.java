package com.betolyn.features.betting.criterion.getcriterionmetrics;

import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.dto.CriterionMetricsDTO;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import com.betolyn.shared.money.BetMoney;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class GetCriterionMetricsUC {
    private final FindCriterionByIdUC findCriterionByIdUC;
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

    public CriterionMetricsDTO execute(String criterionId) throws EntityNotfoundException {
        CriterionEntity criterion = findCriterionByIdUC.execute(criterionId);

        BetMoney reservedLiability = criterion.getReservedLiability();
        BetMoney maxReservedLiability = criterion.getMaxReservedLiability();
        Double riskLevel = safeRatio(reservedLiability, maxReservedLiability);

        int totalBetsCount = criterion.getTotalBetsCount();
        BigDecimal totalStakesVolume = criterion.getTotalStakesVolume().toBigDecimal();

        BigDecimal profitAndLosses = null;
        if (criterion.getStatus() == CriterionStatusEnum.SETTLED) {
            BigDecimal settledStakes = betSlipItemRepository.sumStakeByCriterionIdExcludingVoided(criterionId);
            BigDecimal totalPaidToWinners = betSlipItemRepository.sumPotentialPayoutByCriterionIdAndStatus(
                    criterionId, BetSlipItemStatusEnum.WON);
            if (settledStakes != null && totalPaidToWinners != null) {
                profitAndLosses = settledStakes.subtract(totalPaidToWinners);
            }
        }

        return CriterionMetricsDTO.builder()
                .criterionName(criterion.getName())
                .reservedLiability(reservedLiability.toBigDecimal())
                .maxReservedLiability(maxReservedLiability != null ? maxReservedLiability.toBigDecimal() : null)
                .riskLevel(riskLevel)
                .totalBetsCount(totalBetsCount)
                .totalStakesVolume(totalStakesVolume)
                .profitAndLosses(profitAndLosses)
                .build();
    }
}
