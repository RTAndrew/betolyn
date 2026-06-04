package com.betolyn.features.spaces.addspacemember;

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
@RequestMapping(SpaceApiPaths.MEMBERS)
@RequiredArgsConstructor
public class AddSpaceMember {
    private final AddSpaceMemberUC addSpaceMemberUC;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addMember(
            @PathVariable("id") String spaceId,
            @RequestBody AddSpaceMembersRequest body) {
        addSpaceMemberUC.execute(new AddSpaceMembersParam(spaceId, body.users()));
        return ResponseEntity.ok(ApiResponse.success("Members added successfully"));
    }
}
