package com.betolyn.features.betting.odds.controller;

import com.betolyn.config.systemEvent.SystemEvent;
import com.betolyn.features.betting.odds.CreateOddRequestDTO;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.betting.odds.OddService;
import com.betolyn.features.betting.systemEvents.BettingSystemEvent;
import com.betolyn.utils.UUID;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Controller
@RequestMapping("/odds")
@RequiredArgsConstructor
public class OddController {
    private final OddService oddService;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<OddDTO>>> findAll() {
        var odds = oddService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Odds found", odds));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OddDTO>> save(@RequestBody CreateOddRequestDTO data) {
        var odds = oddService.save(data);

        return ResponseEntity.ok(ApiResponse.success("Odd created", odds));
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        this.emitters.add(emitter);

        try {
            // Send an initial "Connected" event to flush the buffers
            emitter.send(SseEmitter.event().name("INIT").data("connected"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));

        return emitter;
    }

//    @EventListener
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, condition = "#root.event.eventType.equals('betting')")
    public void handleOddUpdate(SystemEvent event) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        String jsonPayload = objectMapper.writeValueAsString(event);

        this.emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                                .id(UUID.random())
                        .name("odd-update")
                        .data(jsonPayload, MediaType.APPLICATION_JSON));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        });

        this.emitters.removeAll(deadEmitters);
    }
}
