package com.betolyn.features.betting.criterion.selectwinningoutcomes;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.shared.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SelectWinningOutcomesUC implements IUseCase<SelectWinningOutcomesParam, CriterionEntity> {

    private final FindCriterionByIdUC findCriterionByIdUC;
    private final OddSystemEvent oddSystemEvent;
    private final CriterionSystemEvent criterionSystemEvent;
    private final CriterionMapper criterionMapper;

    @Override
    @Transactional
    public CriterionEntity execute(SelectWinningOutcomesParam param) {
        var criterion = findCriterionByIdUC.execute(param.criterionId());
        var criterionOdds = criterion.getOdds();
        var odds = param.odds();

        if (odds == null || odds.isEmpty()) {
            return criterion;
        }

        int winnerCount = (int) odds.stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsWinner()))
                .count();
        if (!criterion.getAllowMultipleWinners() && winnerCount > 1) {
            throw new BadRequestException("MULTIPLE_WINNERS_NOT_ALLOWED",
                    "Multiple winners not allowed for this criterion");
        }

        List<OddEntity> updatedOdds = new ArrayList<>();
        for (var item : odds) {
            var odd = criterionOdds.stream()
                    .filter(o -> Objects.equals(o.getId(), item.getId()))
                    .findFirst()
                    .orElseThrow(
                            () -> new BadRequestException("ODD_NOT_IN_CRITERION", "Odd does not belong to criterion"));
            odd.setIsWinner(Boolean.TRUE.equals(item.getIsWinner()));
            updatedOdds.add(odd);
        }

        if (!updatedOdds.isEmpty()) {
            oddSystemEvent.publishOddUpdate(this, updatedOdds);
        }

        criterionSystemEvent.publish(this, "criterionUpdated", criterionMapper.toCriterionDTO(criterion));

        return criterion;
    }
}
