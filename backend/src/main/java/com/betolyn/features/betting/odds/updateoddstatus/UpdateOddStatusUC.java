package com.betolyn.features.betting.odds.updateoddstatus;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddCannotUpdateToDraftException;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UpdateOddStatusUC implements IUseCase<UpdateOddStatusParam, OddEntity> {
    private final FindOddByIdUC findOddByIdUC;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;

    @Override
    @Transactional
    public OddEntity execute(UpdateOddStatusParam param) {
        var foundOdd = findOddByIdUC.execute(param.oddId());
        var newStatus = param.requestDTO().getStatus();

        if (newStatus == OddStatusEnum.DRAFT) {
            throw new OddCannotUpdateToDraftException();
        }

        foundOdd.setStatus(newStatus);

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(foundOdd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        return savedOdd.get();
    }
}
