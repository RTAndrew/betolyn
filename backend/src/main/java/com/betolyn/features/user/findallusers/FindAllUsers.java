package com.betolyn.features.user.findallusers;

import com.betolyn.features.user.UserApiPaths;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(UserApiPaths.USERS)
@RequiredArgsConstructor
public class FindAllUsers {
    private final FindAllUsersUC findAllUsersUC;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> findAll() {
        var users = findAllUsersUC.execute()
                .stream()
                .map(userMapper::toDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Users found", users));
    }
}
