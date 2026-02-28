package com.betolyn.features.betting.odds.updateoddstatus;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.*;
import com.betolyn.features.betting.odds.dto.OddStatusChangedEventDTO;
import com.betolyn.features.betting.odds.exceptions.OddCannotBeActiveWhenCriterionNotActiveException;
import com.betolyn.features.betting.odds.exceptions.OddStatusUpdateNotAllowedException;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.features.betting.odds.saveandsyncodd.SaveAndSyncOddUseCase;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UpdateOddStatusUC implements IUseCase<UpdateOddStatusParam, OddEntity> {
    private static final List<OddStatusEnum> ALLOWED_STATUSES = List.of(OddStatusEnum.ACTIVE, OddStatusEnum.SUSPENDED);

    private final FindOddByIdUC findOddByIdUC;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public OddEntity execute(UpdateOddStatusParam param) {
        var foundOdd = findOddByIdUC.execute(param.oddId());
        var newStatus = param.requestDTO().getStatus();

        if (!ALLOWED_STATUSES.contains(newStatus)) {
            throw new OddStatusUpdateNotAllowedException();
        }
        if (newStatus == OddStatusEnum.ACTIVE && foundOdd.getCriterion().getStatus() != CriterionStatusEnum.ACTIVE) {
            throw new OddCannotBeActiveWhenCriterionNotActiveException();
        }

        foundOdd.setStatus(newStatus);

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(foundOdd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        var eventDTO = new OddStatusChangedEventDTO(List.of(param.oddId()), savedOdd.get().getStatus());
        oddSystemEvent.publish(this, "oddStatusChanged", eventDTO);
        return savedOdd.get();
    }
}
