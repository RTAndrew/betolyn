package com.betolyn.features.betting.criterion.getcriterionmetrics;

import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.dto.CriterionMetricsDTO;
import com.betolyn.features.betting.criterion.dto.CriterionProfitAndLossDTO;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GetCriterionMetricsUC {
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final BetSlipItemRepository betSlipItemRepository;

    public CriterionMetricsDTO execute(String criterionId) throws EntityNotfoundException {
        CriterionEntity criterion = findCriterionByIdUC.execute(criterionId);

        double reservedLiability = criterion.getReservedLiability();
        Double maxReservedLiability = Objects.requireNonNullElse(criterion.getMaxReservedLiability(), 0.0);
        Double riskLevel = 0.0;
        if (maxReservedLiability > 0) {
            riskLevel = (reservedLiability / maxReservedLiability) * 100;
        }

        Double totalBetsCount = criterion.getTotalBetsCount();
        double totalStakesVolume = criterion.getTotalStakesVolume();

        // Potential P/L = Total Stakes - max(All Potential Payouts); maxPayout = reservedLiability + totalStakesVolume
        // or Total Stakes − max(All Potential Payouts)
        double potentialPL = totalStakesVolume - (reservedLiability + totalStakesVolume);

        Double realizedPL = null;
        if (criterion.getStatus() == CriterionStatusEnum.SETTLED) {
            Double totalPaidToWinners = betSlipItemRepository.sumPotentialPayoutByCriterionIdAndStatus(
                    criterionId, BetSlipItemStatusEnum.WON);
            if (totalPaidToWinners != null) {
                realizedPL = totalStakesVolume - totalPaidToWinners;
            }
        }

        CriterionProfitAndLossDTO profitAndLosses = CriterionProfitAndLossDTO.builder()
                .potentialPL(potentialPL)
                .realizedPL(realizedPL)
                .build();

        return CriterionMetricsDTO.builder()
                .criterionName(criterion.getName())
                .reservedLiability(reservedLiability)
                .maxReservedLiability(maxReservedLiability)
                .riskLevel(riskLevel)
                .totalBetsCount(totalBetsCount)
                .totalStakesVolume(totalStakesVolume)
                .profitAndLosses(profitAndLosses)
                .build();
    }
}
