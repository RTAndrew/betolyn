package com.betolyn.features.spaces.members.findspacememberbyid;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
public class FindSpaceMemberById {
    private final FindSpaceMemberByIdUC findSpaceMemberByIdUC;
    private final SpaceMemberMapper spaceMemberMapper;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<SpaceMemberDTO>> findMemberById(
            @PathVariable("id") String spaceId, @PathVariable("memberId") String memberId) {
        var member = findSpaceMemberByIdUC.execute(new FindSpaceMemberByIdParam(spaceId, memberId));
        return ResponseEntity.ok(ApiResponse.success("Space member found", spaceMemberMapper.toDTO(member)));
    }
}
