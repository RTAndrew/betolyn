package com.betolyn.features.matches.getmatchmetrics;

import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.matches.findmatchcriteria.FindMatchCriteriaUC;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GetMatchMetricsUC {
        private final FindMatchByIdUC findMatchByIdUC;
        private final FindMatchCriteriaUC findMatchCriteriaUC;
        private final BetSlipItemRepository betSlipItemRepository;

        public MatchMetricsDTO execute(String matchId) throws EntityNotfoundException {
                var match = findMatchByIdUC.execute(matchId);
                double reservedLiability = Objects.requireNonNullElse(match.getReservedLiability(), 0.0);
                Double maxReservedLiability = match.getMaxReservedLiability();
                double riskLevel = maxReservedLiability != null && maxReservedLiability > 0
                                ? (reservedLiability / maxReservedLiability) * 100
                                : 0.0;

                List<CriterionEntity> criteria = findMatchCriteriaUC.execute(
                                matchId, List.of(CriterionStatusEnum.values()));
                double totalVolume = criteria.stream()
                                .mapToDouble(CriterionEntity::getTotalStakesVolume)
                                .sum();
                long totalBetCount = Math.round(criteria.stream()
                                .mapToDouble(c -> Objects.requireNonNullElse(c.getTotalBetsCount(), 0.0))
                                .sum());

                SettledStakesAndPayoutsDTO settled = getSettledStakesAndPayouts(matchId);
                Double profitAndLosses = settled.settledStakes() == 0
                                ? null
                                : settled.settledStakes() - settled.totalPaidToWinners();

                return MatchMetricsDTO.builder()
                                .totalVolume(totalVolume)
                                .reservedLiability(reservedLiability)
                                .maxReservedLiability(maxReservedLiability)
                                .riskLevel(riskLevel)
                                .totalCriteriaCount(criteria.size())
                                .totalBetCount(totalBetCount)
                                .profitAndLosses(profitAndLosses)
                                .build();
        }

        private SettledStakesAndPayoutsDTO getSettledStakesAndPayouts(String matchId) {
                List<Object[]> rows = betSlipItemRepository.getSettledMatchStakesAndPayouts(matchId);
                if (rows.isEmpty()) {
                        return new SettledStakesAndPayoutsDTO(0.0, 0.0);
                }
                Object[] row = rows.get(0);
                return new SettledStakesAndPayoutsDTO(
                                ((Number) row[0]).doubleValue(),
                                ((Number) row[1]).doubleValue());
        }

        private record SettledStakesAndPayoutsDTO(double settledStakes, double totalPaidToWinners) {
        }
}
