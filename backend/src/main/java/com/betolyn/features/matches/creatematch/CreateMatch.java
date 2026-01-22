package com.betolyn.features.matches.creatematch;

import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchDTO;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class CreateMatch {
    private final CreateMatchUC createMatchUC;
    private final MatchMapper matchMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> createMatch(@RequestBody CreateMatchRequestDTO param) {
        MatchEntity entity = createMatchUC.execute(param);
        MatchDTO dto = matchMapper.toMatchDTO(entity);
        return ResponseEntity.ok(ApiResponse.success("Match created", dto));
    }
}
