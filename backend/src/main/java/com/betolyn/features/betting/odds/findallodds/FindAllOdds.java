package com.betolyn.features.betting.odds.findallodds;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(OddApiPaths.ODDS)
@RequiredArgsConstructor
public class FindAllOdds {
    private final FindAllOddsUC findAllOddsUC;
    private final OddMapper oddMapper;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<OddDTO>>> findAll() {
        var odds = findAllOddsUC.execute()
                .stream()
                .map(oddMapper::toOddDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Odds found", odds));
    }
}
