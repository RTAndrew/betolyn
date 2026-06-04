package com.betolyn.features.spaces.findspacemembers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.features.spaces.SpaceMemberDTO;
import com.betolyn.features.spaces.SpaceMemberMapper;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.MEMBERS)
@RequiredArgsConstructor
public class FindSpaceMembers {
    private final FindSpaceMembersUC findSpaceMembersUC;
    private final SpaceMemberMapper spaceMemberMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SpaceMemberDTO>>> findMembers(
            @PathVariable("id") String spaceId,
            @RequestParam(required = false) String username) {
        var members = findSpaceMembersUC.execute(new FindSpaceMembersParams(spaceId, username));
        return ResponseEntity.ok(ApiResponse.success("Space members found", spaceMemberMapper.toDTO(members)));
    }
}
