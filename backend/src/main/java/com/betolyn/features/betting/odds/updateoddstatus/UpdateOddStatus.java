package com.betolyn.features.betting.odds.updateoddstatus;

import com.betolyn.features.betting.odds.OddApiPaths;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.utils.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OddApiPaths.ODD_STATUS)
@RequiredArgsConstructor
public class UpdateOddStatus {
    private final UpdateOddStatusUC updateOddStatusUC;
    private final OddMapper oddMapper;

    @PutMapping
    public ResponseEntity<ApiResponse<OddDTO>> updateStatus(
            @PathVariable String oddId,
            @RequestBody @Valid UpdateOddStatusRequestDTO requestDTO) {
        var odd = updateOddStatusUC.execute(new UpdateOddStatusParam(oddId, requestDTO));
        return ResponseEntity.ok(ApiResponse.success("Odd status updated", oddMapper.toOddDTO(odd)));
    }
}
