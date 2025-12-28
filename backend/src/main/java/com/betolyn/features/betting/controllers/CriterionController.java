package com.betolyn.features.betting.controllers;

import com.betolyn.features.betting.CriterionEntity;
import com.betolyn.features.betting.CriterionService;
import com.betolyn.features.betting.dtos.CreateCriterionRequestDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/criteria")
@RequiredArgsConstructor
public class CriterionController {
    private final CriterionService criterionService;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<CriterionEntity>>> findAll() {
        var criteria = criterionService.findAll();
        return ResponseEntity.ok(new ApiResponse<>("Criteria found", criteria));
    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<CriterionEntity>> save(@RequestBody CreateCriterionRequestDTO data) {
        var criterion = criterionService.save(data);
        return ResponseEntity.ok(new ApiResponse<>("Criterion created", criterion));
    }

}
