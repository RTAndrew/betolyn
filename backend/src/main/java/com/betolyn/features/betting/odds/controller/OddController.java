package com.betolyn.features.betting.odds.controller;

import com.betolyn.features.betting.odds.CreateOddRequestDTO;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.betting.odds.OddService;
import com.betolyn.shared.sse.ServerSentEventEmitter;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/odds")
@RequiredArgsConstructor
public class OddController {
    private final OddService oddService;

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
}
