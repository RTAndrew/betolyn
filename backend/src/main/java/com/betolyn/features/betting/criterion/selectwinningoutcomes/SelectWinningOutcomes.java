package com.betolyn.features.betting.criterion.selectwinningoutcomes;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.betting.criterion.CriterionApiPaths;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA_WINNING_OUTCOMES)
@RequiredArgsConstructor
public class SelectWinningOutcomes {
    private final SelectWinningOutcomesUC selectWinningOutcomesUC;
    private final CriterionMapper criterionMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<CriterionDTO>> selectWinningOutcomes(
            @PathVariable String criterionId,
            @RequestBody List<WinningOutcomeItemDTO> requestDTO) {
        var criterion = selectWinningOutcomesUC.execute(new SelectWinningOutcomesParam(criterionId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Winning outcomes updated", criterionMapper.toCriterionDTO(criterion)));
    }
}
