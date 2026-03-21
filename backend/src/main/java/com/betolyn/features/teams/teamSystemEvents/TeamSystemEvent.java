package com.betolyn.features.teams.teamSystemEvents;

import com.betolyn.config.systemEvent.ISystemEvent;
import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.shared.sse.ServerSentEventEmitter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public final class TeamSystemEvent implements ISystemEvent {
    private static final String DOMAIN = "team";
    private final ApplicationEventPublisher eventPublisher;
    private final ServerSentEventEmitter sse;

    public void publish(Object source, TeamSseEvent event) {
        var systemEvent = new SystemEvent(source, DOMAIN, event.eventName(), event.payload());
        eventPublisher.publishEvent(systemEvent);
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.domain.equals('team')")
    public void listen(SystemEvent event) {
        sse.emit(event);
    }
}
