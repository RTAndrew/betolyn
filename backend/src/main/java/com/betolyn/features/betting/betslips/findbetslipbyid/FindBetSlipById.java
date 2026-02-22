package com.betolyn.features.betting.betslips.findbetslipbyid;

import com.betolyn.features.betting.betslips.BetSlipApiPaths;
import com.betolyn.features.betting.betslips.BetSlipMapper;
import com.betolyn.features.betting.betslips.dto.BetSlipDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BetSlipApiPaths.ROOT)
@RequiredArgsConstructor
public class FindBetSlipById {
    private final FindBetSlipByIdUC findBetSlipByIdUC;
    private final BetSlipMapper betSlipMapper;

    @GetMapping("/{betSlipId}")
    public ResponseEntity<ApiResponse<BetSlipDTO>> findById(@PathVariable String betSlipId) {
        var betSlip = findBetSlipByIdUC.execute(betSlipId);
        return ResponseEntity.ok(ApiResponse.success("Bet slip found", betSlipMapper.toBetSlipDTO(betSlip)));
    }
}
