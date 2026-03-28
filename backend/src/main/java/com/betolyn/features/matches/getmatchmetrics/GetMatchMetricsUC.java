package com.betolyn.features.matches.getmatchmetrics;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.findmatchcriteria.FindMatchCriteriaUC;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import com.betolyn.shared.money.BetMoney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetMatchMetricsUC {
    private final FindMatchByIdUC findMatchByIdUC;
    private final FindMatchCriteriaUC findMatchCriteriaUC;
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

    public MatchMetricsDTO execute(String matchId) throws EntityNotfoundException {
        var match = findMatchByIdUC.execute(matchId);
        BetMoney reservedLiability = Objects.requireNonNullElse(match.getReservedLiability(), BetMoney.zero());
        BetMoney maxReservedLiability = match.getMaxReservedLiability();
        double riskLevel = safeRatio(reservedLiability, maxReservedLiability);

        List<CriterionEntity> criteria = findMatchCriteriaUC.execute(
                matchId, List.of(CriterionStatusEnum.values()));
        BetMoney totalVolume = criteria.stream()
                .map(CriterionEntity::getTotalStakesVolume)
                .reduce(BetMoney.zero(), BetMoney::add);
        int totalBetCount = criteria.stream()
                .mapToInt(CriterionEntity::getTotalBetsCount)
                .sum();

        SettledStakesAndPayoutsDTO settled = getSettledStakesAndPayouts(matchId);
        BigDecimal profitAndLosses = settled.settledStakes().isZero()
                ? null
                : settled.settledStakes().subtract(settled.totalPaidToWinners()).toBigDecimal();

        return MatchMetricsDTO.builder()
                .totalVolume(totalVolume.toBigDecimal())
                .reservedLiability(reservedLiability.toBigDecimal())
                .maxReservedLiability(maxReservedLiability != null ? maxReservedLiability.toBigDecimal() : null)
                .riskLevel(riskLevel)
                .totalCriteriaCount(criteria.size())
                .totalBetCount(totalBetCount)
                .profitAndLosses(profitAndLosses)
                .build();
    }

    private SettledStakesAndPayoutsDTO getSettledStakesAndPayouts(String matchId) {
        List<Object[]> rows = betSlipItemRepository.getSettledMatchStakesAndPayouts(matchId);
        if (rows.isEmpty()) {
            return new SettledStakesAndPayoutsDTO(BetMoney.zero(), BetMoney.zero());
        }
        Object[] row = rows.get(0);
        BetMoney stakes = row[0] instanceof BigDecimal ? BetMoney.of((BigDecimal) row[0]) : BetMoney.of(((Number) row[0]).doubleValue());
        BetMoney payouts = row[1] instanceof BigDecimal ? BetMoney.of((BigDecimal) row[1]) : BetMoney.of(((Number) row[1]).doubleValue());
        return new SettledStakesAndPayoutsDTO(stakes, payouts);
    }

    private record SettledStakesAndPayoutsDTO(BetMoney settledStakes, BetMoney totalPaidToWinners) {
    }
}
