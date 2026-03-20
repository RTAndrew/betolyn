package com.betolyn.features.feedsync;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * Seeds {@code ingestion_state} rows for teams/events cursors if the table is empty.
 */
@Component
@Order(100)
@RequiredArgsConstructor
public class IngestionStateSeedRunner implements ApplicationRunner {

    private final IngestionStateRepository ingestionStateRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (ingestionStateRepository.count() > 0) {
            return;
        }
        var teams = new IngestionStateEntity();
        teams.setSource(IngestionStateEntity.SOURCE_TEAMS);
        ingestionStateRepository.save(teams);

        var events = new IngestionStateEntity();
        events.setSource(IngestionStateEntity.SOURCE_EVENTS);
        ingestionStateRepository.save(events);
    }
}
