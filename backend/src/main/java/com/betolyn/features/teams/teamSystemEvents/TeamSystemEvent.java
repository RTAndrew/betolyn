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

    @Override
    public void publish(Object source, String eventName, Object data) {
        var event = new SystemEvent(source, DOMAIN, eventName, data);
        eventPublisher.publishEvent(event);
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.domain.equals('team')")
    public void listen(SystemEvent event) {
        sse.emitEvent(event.getEventName(), event);
    }
}
