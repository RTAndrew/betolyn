package com.betolyn.features.betting.controllers;

import com.betolyn.features.betting.OddEntity;
import com.betolyn.features.betting.OddService;
import com.betolyn.features.betting.dtos.CreateOddRequestDTO;
import com.betolyn.features.betting.dtos.OddDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/odds")
@RequiredArgsConstructor
public class OddController {
    private final OddService oddService;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<OddEntity>>> findAll() {
        var odds = oddService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Odds found", odds));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OddDTO>> save(@RequestBody CreateOddRequestDTO data) {
        var odds = oddService.save(data);
        return ResponseEntity.ok(ApiResponse.success("Odd created", odds));
    }

}
