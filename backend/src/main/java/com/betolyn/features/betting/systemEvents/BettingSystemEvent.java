package com.betolyn.features.betting.systemEvents;

import com.betolyn.config.systemEvent.ISystemEvent;
import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.utils.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;


@Component
@RequiredArgsConstructor
public class BettingSystemEvent implements ISystemEvent<String> {
    private static final String EVENT_TYPE = "betting";
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public void publish(Object source, String channel, Object data) {
        var event = new SystemEvent(source, EVENT_TYPE, channel, data);
        eventPublisher.publishEvent(event);
    }

    @Override
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void listen(SystemEvent event) {

    }
//    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
//    public void handleOddUpdate(SystemEvent event) {
//        List<SseEmitter> deadEmitters = new ArrayList<>();
//        String jsonPayload = objectMapper.writeValueAsString(event);
//
//        this.emitters.forEach(emitter -> {
//            try {
//                emitter.send(SseEmitter.event()
//                        .id(UUID.random())
//                        .name("odd-update")
//                        .data(jsonPayload, MediaType.APPLICATION_JSON));
//            } catch (Exception e) {
//                deadEmitters.add(emitter);
//            }
//        });
//
//        this.emitters.removeAll(deadEmitters);
//    }
}
