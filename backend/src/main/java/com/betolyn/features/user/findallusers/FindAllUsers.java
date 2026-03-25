package com.betolyn.features.user.findallusers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.user.UserApiPaths;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(UserApiPaths.USERS)
@RequiredArgsConstructor
public class FindAllUsers {
    private final FindAllUsersUC findAllUsersUC;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> findAll() {
        var users = findAllUsersUC.execute(Optional.empty())
                .stream()
                .map(userMapper::toDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Users found", users));
    }
}
