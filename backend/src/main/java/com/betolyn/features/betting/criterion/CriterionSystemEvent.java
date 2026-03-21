package com.betolyn.features.betting.criterion;

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
public final class CriterionSystemEvent implements ISystemEvent {
    private static final String DOMAIN = "criterion";
    private final ApplicationEventPublisher eventPublisher;
    private final ServerSentEventEmitter sse;
    private final CriterionMapper criterionMapper;

    public void publish(Object source, CriterionSseEvent event) {
        var systemEvent = new SystemEvent(source, DOMAIN, event.eventName(), event.payload());
        eventPublisher.publishEvent(systemEvent);
    }

    public void publishCriterionUpdate(Object source, CriterionEntity criterion) {
        publish(source, new CriterionSseEvent.CriterionUpdated(criterionMapper.toCriterionDTO(criterion)));
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.domain.equals('criterion')")
    public void listen(SystemEvent event) {
        sse.emit(event);
    }
}
