package com.betolyn.features.betting.odds.publishodd;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OddApiPaths.ODD_PUBLISH)
@RequiredArgsConstructor
public class PublishOdd {
    private final PublishOddUC publishOddUC;
    private final OddMapper oddMapper;

    @PatchMapping
    public ResponseEntity<ApiResponse<OddDTO>> publish(@PathVariable String oddId) {
        var odd = publishOddUC.execute(oddId);
        return ResponseEntity.ok(ApiResponse.success("Odd published", oddMapper.toOddDTO(odd)));
    }
}
