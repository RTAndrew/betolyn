package com.betolyn.features.spaces.allocatespacefund;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.FUND)
@RequiredArgsConstructor
public class AllocateSpaceFund {
    private final AllocateSpaceFundUC allocateSpaceFundUC;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> allocate(
            @PathVariable("id") String spaceId,
            @RequestBody AllocateSpaceFundRequest body) {
        allocateSpaceFundUC.execute(new AllocateSpaceFundParam(spaceId, body.memo(), body.amount()));
        return ResponseEntity.ok(ApiResponse.success("Funds allocated"));
    }
}
