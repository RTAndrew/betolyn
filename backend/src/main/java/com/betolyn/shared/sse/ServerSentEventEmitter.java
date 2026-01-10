package com.betolyn.shared.sse;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tools.jackson.databind.ObjectMapper;

import java.sql.Time;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/** It keeps track of connected clients and broadcasts events to them. */
@Getter
@RequiredArgsConstructor
@Component
public class ServerSentEventEmitter {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

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
}
