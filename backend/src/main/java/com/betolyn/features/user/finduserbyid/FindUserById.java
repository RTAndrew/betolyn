package com.betolyn.features.user.finduserbyid;

import com.betolyn.features.user.UserApiPaths;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(UserApiPaths.USERS)
@RequiredArgsConstructor
public class FindUserById {
    private final FindUserByIdUC findUserByIdUC;
    private final UserMapper userMapper;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> findById(@PathVariable String userId) {
        var user = findUserByIdUC.execute(userId);
        return ResponseEntity.ok(ApiResponse.success("User found", userMapper.toDTO(user)));
    }
}
