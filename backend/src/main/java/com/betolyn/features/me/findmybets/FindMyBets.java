package com.betolyn.features.me.findmybets;

import com.betolyn.features.me.MeApiPaths;
import com.betolyn.features.betting.betslips.BetSlipMapper;
import com.betolyn.features.betting.betslips.dto.BetSlipDTO;
import com.betolyn.features.betting.betslips.dto.BetSlipItemDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(MeApiPaths.ME)
@RequiredArgsConstructor
public class FindMyBets {
    private final FindMyBetsUC findMyBetsUC;
    private final FindMyBetSlipItemByIdUC findMyBetSlipItemByIdUC;
    private final BetSlipMapper betSlipMapper;

    @GetMapping("/bets")
    public ResponseEntity<@NotNull ApiResponse<List<BetSlipDTO>>> findMyBets() {
        var betSlips = findMyBetsUC.execute();
        var response = betSlips.stream()
                .map(betSlipMapper::toBetSlipDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Bet history found", response));
    }

    @GetMapping("/bets/items/{betSlipItemId}")
    public ResponseEntity<@NotNull ApiResponse<BetSlipItemDTO>> findMyBetSlipItemById(@PathVariable String betSlipItemId) {
        var betSlipItem = findMyBetSlipItemByIdUC.execute(betSlipItemId);
        var response = BetSlipMapper.toBetSlipItemDTO(betSlipItem);
        return ResponseEntity.ok(ApiResponse.success("Bet slip item found", response));
    }
}
