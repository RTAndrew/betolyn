package com.betolyn.features.betting.criterion.updatecriterionodds;

import com.betolyn.config.systemEvent.DefaultSystemEventNames;
import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.bulkupdateodds.BulkUpdateOddsUC;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BulkUpdateCriteriaOddsUC implements IUseCase<UpdateCriterionOddsParam, CriterionEntity> {
    private final BulkUpdateOddsUC bulkUpdateOddsUC;
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionSystemEvent criterionSystemEvent;

    record BulkUpdateCriteriaOddsEventDTO(String criterionId, String matchId, List<String> odds){}

    @Override
    @Transactional
    public CriterionEntity execute(UpdateCriterionOddsParam param) {
        var criterion = findCriterionByIdUC.execute(param.criterionId());

        // Find all odds to get the most recent value
        // then add "from" -> "to".

        List<OddEntity> odds = param.requestDTO().getOdds().stream().map(odd -> {
            var status = OddStatusEnum.ACTIVE;
            if (odd.status() != null) {
                status = odd.status();
            }

            var foundOddFromCriterion = criterion.getOdds().stream()
                    .filter((o) -> Objects.equals(o.getId(), odd.id()))
                    .findFirst();

            var tempOdd = new OddEntity();
            foundOddFromCriterion.ifPresent(oddDTO -> tempOdd.setName(oddDTO.getName()));

            tempOdd.setCriterion(criterion);
            tempOdd.setStatus(status);
            tempOdd.setValue(odd.value());
            tempOdd.setId(odd.id());

            return tempOdd;
        }).toList();

        bulkUpdateOddsUC.execute(odds);

        var eventDTO = new BulkUpdateCriteriaOddsEventDTO(
                criterion.getId(),
                criterion.getMatch().getId(),
                param.requestDTO().getOdds().stream().map(odd -> odd.id()).toList()
        );
        criterionSystemEvent.publish(this, DefaultSystemEventNames.REFRESH_REQUIRED.name(), eventDTO);

        return findCriterionByIdUC.execute(param.criterionId());
    }
}
