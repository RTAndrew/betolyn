package com.betolyn.features.betting.odds.updateoddvalue;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

enum OddValueChangeDirection {
    UP,
    DOWN
}
record UpdateOddValueEventDTO(String oddId, OddValueChangeDirection direction, Double value){}

@Service
@RequiredArgsConstructor
public class UpdateOddValueUC implements IUseCase<UpdateOddValueParam, OddEntity> {
    private final FindOddByIdUC findOddByIdUC;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public OddEntity execute(UpdateOddValueParam param) {
        OddValueChangeDirection oddValueChangeDirection;
        var foundOdd = findOddByIdUC.execute(param.oddId());

        if(foundOdd.getValue() == param.requestDTO().getValue()) {
            throw new BusinessRuleException("INVALID_ODD_VALUE", "The odd value cannot be the same as the previous one");
        }
        if (foundOdd.getStatus() != OddStatusEnum.ACTIVE) {
            throw new BusinessRuleException("INVALID_ODD_STATUS", "Only odds with active state are allowed to be edited");
        }

        oddValueChangeDirection = param.requestDTO().getValue() > foundOdd.getValue()
                ? OddValueChangeDirection.UP
                : OddValueChangeDirection.DOWN;

        foundOdd.setValue(param.requestDTO().getValue());
        var savedOdd = saveAndSyncOddUseCase.execute(List.of(foundOdd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        var eventDTO = new UpdateOddValueEventDTO(savedOdd.get().getId(),oddValueChangeDirection,  savedOdd.get().getValue());
        oddSystemEvent.publish(this, "oddValueChanged",eventDTO);
        return savedOdd.get();
    }
}
