package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.criterion.dto.CreateCriterionRequestDTO;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.dto.UpdateCriterionOddsRequestDTO;
import com.betolyn.features.betting.criterion.dto.UpdateCriterionRequestDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/criteria")
@RequiredArgsConstructor
public class CriterionController {
    private final CriterionService criterionService;
    private final CriterionMapper criterionMapper;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<CriterionDTO>>> findAll() {
        var criteria = criterionService.findAll();
        var mapp = criteria.stream().map(criterionMapper::toCriterionDTO).toList();
        return ResponseEntity.ok(ApiResponse.success("Criteria found", mapp));
    }

    @GetMapping("/{criterionId}")
    public ResponseEntity<ApiResponse<CriterionDTO>> findById(@PathVariable String criterionId) {
        var criterion = criterionService.findById(criterionId);

        return ResponseEntity.ok(ApiResponse.success("Criterion found", criterionMapper.toCriterionDTO(criterion)));
    }

    @PatchMapping("/{criterionId}")
    public ResponseEntity<ApiResponse<CriterionDTO>> update(@PathVariable String criterionId, @RequestBody UpdateCriterionRequestDTO requestDTO) {
        var criterion = criterionService.update(criterionId, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Criterion updated", criterionMapper.toCriterionDTO(criterion)));
    }
    @PatchMapping("/{criterionId}/odds")
    public ResponseEntity<ApiResponse<CriterionDTO>> updateOdds(@PathVariable String criterionId, @RequestBody UpdateCriterionOddsRequestDTO requestDTO) {
        var criterion = criterionService.updateOdds(criterionId, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Criterion updated", criterionMapper.toCriterionDTO(criterion)));
    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<CriterionDTO>> save(@RequestBody CreateCriterionRequestDTO data) {
        var criterion = criterionService.save(data);
        return ResponseEntity.ok(ApiResponse.success("Criterion created", criterion));
    }
}
