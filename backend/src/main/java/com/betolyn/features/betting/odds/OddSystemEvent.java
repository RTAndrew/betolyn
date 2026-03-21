package com.betolyn.features.betting.odds;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.betolyn.config.systemEvent.ISystemEvent;
import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.shared.sse.ServerSentEventEmitter;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public final class OddSystemEvent implements ISystemEvent {
    private static final String DOMAIN = "odd";
    private final ServerSentEventEmitter sse;
    private final ApplicationEventPublisher eventPublisher;
    private final OddMapper oddMapper;

    public void publish(Object source, OddSseEvent event) {
        var systemEvent = new SystemEvent(source, DOMAIN, event.eventName(), event.payload());
        eventPublisher.publishEvent(systemEvent);
    }

    public void publishOddUpdate(Object source, OddEntity odd) {
        publish(source, new OddSseEvent.OddUpdated(oddMapper.toOddDTO(odd)));
    }

    public void publishOddUpdate(Object source, List<OddEntity> odds) {
        odds.forEach(odd -> publishOddUpdate(source, odd));
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.domain.equals('odd')")
    public void listen(SystemEvent event) {
        sse.emit(event);
    }
}
