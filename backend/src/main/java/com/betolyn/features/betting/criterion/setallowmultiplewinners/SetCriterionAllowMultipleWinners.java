package com.betolyn.features.betting.criterion.setallowmultiplewinners;

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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(CriterionApiPaths.CRITERIA_ALLOW_MULTIPLE_WINNERS)
@RequiredArgsConstructor
public class SetCriterionAllowMultipleWinners {
        private final SetCriterionAllowMultipleWinnersUC setCriterionAllowMultipleWinnersUC;
        private final CriterionMapper criterionMapper;

        @PostMapping
        public ResponseEntity<ApiResponse<CriterionDTO>> setAllowMultipleWinners(
                        @PathVariable String criterionId,
                        @RequestBody @Valid SetAllowMultipleWinnersRequestDTO requestDTO) {
                var criterion = setCriterionAllowMultipleWinnersUC.execute(
                                new SetAllowMultipleWinnersParam(criterionId, requestDTO.getAllowMultipleWinners()));
                return ResponseEntity.ok(ApiResponse.success(
                                "Allow multiple winners updated",
                                criterionMapper.toCriterionDTO(criterion)));
        }
}
