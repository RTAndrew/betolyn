package com.betolyn.features.betting.betslips.placebet;

import com.betolyn.features.betting.betslips.BetSlipApiPaths;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(BetSlipApiPaths.ROOT)
@RequiredArgsConstructor
public class PlaceBet {
    private final PlaceBetUC placeBetUC;

    @PostMapping
    @Transactional
    public ResponseEntity<@NotNull ApiResponse<Object>> placeBet(@RequestBody PlaceBetRequestDTO requestDTO) {
            var response = placeBetUC.execute(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Criteria found", response));
    }
}
