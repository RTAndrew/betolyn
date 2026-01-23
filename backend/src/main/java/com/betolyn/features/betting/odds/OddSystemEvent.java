package com.betolyn.features.betting.odds;

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
public final class OddSystemEvent implements ISystemEvent {
    private static final String DOMAIN = "odd";
    private final ServerSentEventEmitter sse;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public void publish(Object source, String eventName, Object data) {
        var event = new SystemEvent(source, DOMAIN, eventName, data);
        eventPublisher.publishEvent(event);
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.domain.equals('odd')")
    public void listen(SystemEvent event) {
        sse.emitEvent(event.getEventName(), event);
    }
}
