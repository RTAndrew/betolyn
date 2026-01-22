package com.betolyn.features.betting.odds.bulksaveodds;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
import com.betolyn.shared.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BulkSaveOddsUC implements IUseCase<List<OddEntity>, List<OddEntity>> {
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;

    @Override
    @Transactional
    public List<OddEntity> execute(List<OddEntity> odds) {
        checkIfOddsAreActiveOrThrow(odds);
        return saveAndSyncOddUseCase.execute(odds);
    }

    private void checkIfOddsAreActiveOrThrow(List<OddEntity> odds) {
        boolean hasInvalid = odds.stream().anyMatch(odd -> odd.getStatus() != OddStatusEnum.ACTIVE);

        if (hasInvalid) {
            throw new BusinessRuleException("INVALID_ODDS", "Only odds with active state are allowed to be edited");
        }
    }
}
