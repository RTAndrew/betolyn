package com.betolyn.features.betting.odds.findoddbyid;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OddApiPaths.ODDS)
@RequiredArgsConstructor
public class FindOddById {
    private final FindOddByIdUC findOddByIdUC;
    private final OddMapper oddMapper;

    @GetMapping("/{oddId}")
    public ResponseEntity<ApiResponse<OddDTO>> findById(@PathVariable String oddId) {
        var odd = findOddByIdUC.execute(oddId);
        return ResponseEntity.ok(ApiResponse.success("Odd found", oddMapper.toOddDTO(odd)));
    }
}
