package com.betolyn.features.betting.odds;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Saves an odd and creates/updates its respective history data */
@Service
@RequiredArgsConstructor
public class SaveAndSyncOddUseCase {
    private final OddRepository oddRepository;

    @Transactional
    public List<OddEntity> execute(List<OddEntity> odds) {

        for(var odd: odds) {
            // 1. Create oddHistory and link with odd
            var history = new OddHistoryEntity();
            history.generateId(); // ensure the ID is available in memory
            history.setOdd(odd);
            history.setValue(odd.getValue());
            history.setStatus(odd.getStatus());

            // 2. Link the oddHistory back to the odd
            odd.setLastOddHistory(history);
        }

        oddRepository.saveAll(odds);
        return odds;
    }
}
