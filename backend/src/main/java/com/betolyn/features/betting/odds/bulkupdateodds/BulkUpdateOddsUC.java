package com.betolyn.features.betting.odds.bulkupdateodds;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BulkUpdateOddsUC implements IUseCase<List<OddEntity>, List<OddEntity>> {
    private final OddRepository oddRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;

    @Override
    @Transactional
    public List<OddEntity> execute(List<OddEntity> odds) {
        // 1. Check if the incoming odds have status.ACTIVE
        checkIfOddsAreActiveOrThrow(odds);

        // 2. Fetch all incoming odds and check if they have status.ACTIVE
        List<String> oddIdArray = odds.stream().map(BaseEntity::getId).toList();
        var foundOdds = oddRepository.findAllById(oddIdArray);
        checkIfOddsAreActiveOrThrow(foundOdds);

        // 3. Save
        return saveAndSyncOddUseCase.execute(odds);
    }

    private void checkIfOddsAreActiveOrThrow(List<OddEntity> odds) {
        boolean hasInvalid = odds.stream().anyMatch(odd -> odd.getStatus() != OddStatusEnum.ACTIVE);

        if (hasInvalid) {
            throw new BusinessRuleException("INVALID_ODDS", "Only odds with active state are allowed to be edited");
        }
    }
}
