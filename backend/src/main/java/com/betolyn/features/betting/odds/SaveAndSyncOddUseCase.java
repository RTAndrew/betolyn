package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.systemEvents.BettingSystemEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

/** Saves an odd and creates/updates its respective history data */
@Service
@RequiredArgsConstructor
public class SaveAndSyncOddUseCase {
    private final OddRepository oddRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final BettingSystemEvent bettingSystemEvent;
    private final ObjectMapper objectMapper;

    @Transactional
    protected List<OddEntity> execute(List<OddEntity> odds) {

        for(var odd: odds) {
            // 1. ensure the ID is available in memory (and not at DB)
            odd.generateId();

            // 2. Create oddHistory and link with odd
            var history = new OddHistoryEntity();
            history.generateId(); // ensure the ID is available in memory
            history.setOdd(odd);
            history.setValue(odd.getValue());
            history.setStatus(odd.getStatus());

            // 3. Link the oddHistory back to the odd
            odd.setLastOddHistory(history);
        }


        bettingSystemEvent.publish(this, "oddUpdated", odds);
//        eventPublisher.publishEvent(odds);
//        eventPublisher.publishEvent(jsonPayload);
        return oddRepository.saveAll(odds);
    }
}
