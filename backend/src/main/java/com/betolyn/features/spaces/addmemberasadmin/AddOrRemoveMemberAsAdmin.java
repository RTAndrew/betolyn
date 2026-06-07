package com.betolyn.features.spaces.addmemberasadmin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.features.spaces.SpaceMemberDTO;
import com.betolyn.features.spaces.SpaceMemberMapper;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.MEMBER)
@RequiredArgsConstructor
public class AddOrRemoveMemberAsAdmin {
    private final AddOrRemoveMemberAsAdminUC addOrRemoveMemberAsAdminUC;
    private final SpaceMemberMapper spaceMemberMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<SpaceMemberDTO>> addOrRemoveMemberAsAdmin(
            @PathVariable("id") String spaceId,
            @PathVariable("memberId") String memberId, @RequestBody AddOrRemoveMemberAsAdminRequest body) {
        var member = addOrRemoveMemberAsAdminUC
                .execute(new AddOrRemoveMemberAsAdminParam(spaceId, memberId, body.value()));
        return ResponseEntity.ok(ApiResponse.success("Space members found", spaceMemberMapper.toDTO(member)));
    }
}
