package com.betolyn.features.betting.bettingSystemEvents;

import com.betolyn.config.systemEvent.ISystemEvent;
import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.shared.sse.ServerSentEventEmitter;
import com.betolyn.utils.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public final class BettingSystemEvent implements ISystemEvent {
    private static final String EVENT_TYPE = "betting";
    private final ApplicationEventPublisher eventPublisher;
    private final ServerSentEventEmitter sse;
    private final ObjectMapper objectMapper;
    private final OddMapper oddMapper;

    @Override
    public void publish(Object source, String channel, Object data) {
        var event = new SystemEvent(source, EVENT_TYPE, channel, data);
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
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.eventType.equals('betting')")
    public void listen(SystemEvent event) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        String jsonPayload = objectMapper.writeValueAsString(event);

        sse.getEmitters().forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .id(UUID.random())
                        .name("odd-update")
                        .data(jsonPayload, MediaType.APPLICATION_JSON));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        });

        sse.getEmitters().removeAll(deadEmitters);
    }
}
