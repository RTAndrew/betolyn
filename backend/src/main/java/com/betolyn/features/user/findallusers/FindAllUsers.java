package com.betolyn.features.user.findallusers;

import com.betolyn.features.user.UserApiPaths;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.features.user.searchusers.SearchUsersParams;
import com.betolyn.features.user.searchusers.SearchUsersUC;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(UserApiPaths.USERS)
@RequiredArgsConstructor
public class FindAllUsers {
    private final SearchUsersUC searchUsers;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> findByQueryStrings(
            @Nullable @RequestParam("id") String id,
            @Nullable @RequestParam("username") String username,
            @Nullable @RequestParam("email") String email) {
        var user = searchUsers.execute(new SearchUsersParams(id, username, email));
        return ResponseEntity.ok(ApiResponse.success("User found", userMapper.toDTO(user)));
    }
}
