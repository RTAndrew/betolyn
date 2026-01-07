package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.criterion.dto.CreateCriterionRequestDTO;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
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
        return ResponseEntity.ok(ApiResponse.success("Criteria found", criteria));
    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<CriterionDTO>> save(@RequestBody CreateCriterionRequestDTO data) {
        var criterion = criterionService.save(data);
        return ResponseEntity.ok(ApiResponse.success("Criterion created", criterion));
    }

}
