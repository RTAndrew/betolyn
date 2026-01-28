package com.betolyn.features.betting.odds.bulksaveodds;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
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
        return saveAndSyncOddUseCase.execute(odds);
    }
}
