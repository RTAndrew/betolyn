package com.betolyn.features.betting.criterion;

import com.betolyn.config.systemEvent.ISystemEvent;
import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.shared.sse.ServerSentEventEmitter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Component
@RequiredArgsConstructor
public final class CriterionSystemEvent implements ISystemEvent {
    private static final String DOMAIN = "criterion";
    private final ApplicationEventPublisher eventPublisher;
    private final ServerSentEventEmitter sse;
    private final OddMapper oddMapper;

    @Override
    public void publish(Object source, String eventName, Object data) {
        var event = new SystemEvent(source, DOMAIN, eventName, data);
        eventPublisher.publishEvent(event);
    }

    public void publishOddUpdate(Object source, OddEntity odd) {
        var channelId = "oddUpdated:" + odd.getId();
        this.publish(source, channelId, odd);

    }

    public void publishOddUpdate(Object source, List<OddEntity> odds) {
        odds.forEach(odd -> {
            var channelId = "oddUpdated:" + odd.getId();
            this.publish(source, channelId, oddMapper.toOddDTO(odd));
        });
    }

    public void publishCriterionUpdate(Object source, CriterionEntity criterion) {
        var channelId = "criterionUpdated:" + criterion.getId();
        this.publish(source, channelId, criterion);
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.domain.equals('criterion')")
    public void listen(SystemEvent event) {
        sse.emitEvent(event.getEventName(), event);
    }
}
