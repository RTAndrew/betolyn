package com.betolyn.features.user.finduserbyusername;

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
public class FindUserByUsername {
    private final FindUserByUsernameUC findUserByUsernameUC;
    private final UserMapper userMapper;

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UserDTO>> findByUsername(@PathVariable String username) {
        var user = findUserByUsernameUC.execute(username);
        return ResponseEntity.ok(ApiResponse.success("User found", userMapper.toDTO(user)));
    }
}
