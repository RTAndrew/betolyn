package com.betolyn.features.matches.matchSystemEvents;

import com.betolyn.config.systemEvent.ISystemEvent;
import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.features.matches.MatchEntity;
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
public final class MatchSystemEvent implements ISystemEvent {
    private static final String EVENT_TYPE = "match";
    private final ApplicationEventPublisher eventPublisher;
    private final ServerSentEventEmitter sse;
    private final ObjectMapper objectMapper;

    @Override
    public void publish(Object source, String channel, Object data) {
        var event = new SystemEvent(source, EVENT_TYPE, channel, data);
        eventPublisher.publishEvent(event);
    }

    public void publicMatchUpdate(Object source, MatchEntity match) {
        var channelId = "matchUpdated:" + match.getId();
        this.publish(source, channelId, match);
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.eventType.equals('match')")
    public void listen(SystemEvent event) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        String jsonPayload = objectMapper.writeValueAsString(event);

        sse.getEmitters().forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .id(UUID.random())
                        .name("match")
                        .data(jsonPayload, MediaType.APPLICATION_JSON));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        });

        sse.getEmitters().removeAll(deadEmitters);
    }
}
