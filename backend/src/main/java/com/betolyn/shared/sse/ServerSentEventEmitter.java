package com.betolyn.shared.sse;

import com.betolyn.utils.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tools.jackson.databind.ObjectMapper;

import java.sql.Time;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/** It keeps track of connected clients and broadcasts events to them. */
@Getter
@RequiredArgsConstructor
@Component
public class ServerSentEventEmitter {
    private final ObjectMapper objectMapper;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private static final Logger log = LogManager.getLogger(ServerSentEventEmitter.class);

    public SseEmitter newEmitter() {
        var timeOutInSeconds = Instant.now().plus(1, ChronoUnit.MINUTES).toEpochMilli();
        SseEmitter emitter = new SseEmitter(timeOutInSeconds);
        this.addEmitter(emitter);
        return emitter;
    }

    public void addEmitter(SseEmitter emitter) {
        this.emitters.add(emitter);

        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
    }

    public void emitEvent (String eventName, Object payload) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        String jsonPayload = objectMapper.writeValueAsString(payload);

        this.emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .id(UUID.random())
                        .name(eventName)
                        .data(jsonPayload, MediaType.APPLICATION_JSON));
            } catch (Exception e) {
                deadEmitters.add(emitter);
                log.info("[SSE] The emitter at was found dead: {}", emitter.toString());
            }
        });

        this.emitters.removeAll(deadEmitters);
    }
}
