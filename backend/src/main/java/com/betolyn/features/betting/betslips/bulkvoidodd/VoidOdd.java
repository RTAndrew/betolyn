package com.betolyn.features.betting.betslips.bulkvoidodd;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OddApiPaths.ODDS)
@RequiredArgsConstructor
public class VoidOdd {
    private final VoidOddUC voidOddUC;

    @PostMapping("/{oddId}/void")
    public ResponseEntity<ApiResponse<String>> voidOdd(
            @PathVariable String oddId,
            @RequestBody @Valid VoidReasonRequestDTO requestDTO) {
        voidOddUC.execute(new VoidOddParam(oddId, requestDTO.getReason()));
        return ResponseEntity.ok(ApiResponse.success("Odd voided", null));
    }
}
