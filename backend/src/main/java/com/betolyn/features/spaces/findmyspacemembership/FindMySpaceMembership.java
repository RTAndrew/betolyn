package com.betolyn.features.spaces.findmyspacemembership;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.ROOT)
@RequiredArgsConstructor
public class FindMySpaceMembership {
    private final FindMySpaceMembershipUC findMySpaceMembershipUC;

    @GetMapping("/{spaceId}/membership")
    public ResponseEntity<ApiResponse<SpaceMembershipDTO>> findMyMembership(@PathVariable String spaceId) {
        var dto = findMySpaceMembershipUC.execute(spaceId);
        return ResponseEntity.ok(ApiResponse.success("Space membership", dto));
    }
}
