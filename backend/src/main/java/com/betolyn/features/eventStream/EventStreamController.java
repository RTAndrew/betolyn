package com.betolyn.features.eventstream;

import com.betolyn.shared.sse.ServerSentEventEmitter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Controller
@RequestMapping("/stream")
@RequiredArgsConstructor
public class EventStreamController {
    private final ServerSentEventEmitter sse;

    @GetMapping( produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        SseEmitter emitter = sse.newEmitter();

        try {
            // Send an initial "Connected" event to flush the buffers
            emitter.send(SseEmitter.event().name("INIT").data("connected"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }
}
