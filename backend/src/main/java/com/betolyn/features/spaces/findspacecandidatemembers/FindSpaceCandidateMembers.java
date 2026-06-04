package com.betolyn.features.spaces.findspacecandidatemembers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.spaces.SpaceApiPaths;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SpaceApiPaths.CANDIDATE_MEMBERS)
@RequiredArgsConstructor
public class FindSpaceCandidateMembers {
    private final FindSpaceCandidateMembersUC findSpaceCandidateMembersUC;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> findCandidateMembers(
            @PathVariable("id") String spaceId,
            @RequestParam(required = false) String username) {
        var users = findSpaceCandidateMembersUC
                .execute(new FindSpaceCandidateMembersParams(spaceId, username));
        return ResponseEntity.ok(ApiResponse.success("Users found", userMapper.toDTO(users)));
    }
}
