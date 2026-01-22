package com.betolyn.features.betting.odds.createodd;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OddApiPaths.ODDS)
@RequiredArgsConstructor
public class CreateOdd {
    private final CreateOddUC createOddUC;

    @PostMapping
    public ResponseEntity<ApiResponse<OddDTO>> save(@RequestBody CreateOddRequestDTO data) {
        var odd = createOddUC.execute(data);
        return ResponseEntity.ok(ApiResponse.success("Odd created", odd));
    }
}
