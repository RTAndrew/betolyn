package com.betolyn.features.spaces;

import java.time.LocalDateTime;

import com.betolyn.features.user.UserDTO;

import lombok.Data;

@Data
public class SpaceMemberDTO {
    private String id;
    private UserDTO user;
    private Boolean isAdmin;
    private SpaceDTO space;
    private LocalDateTime createdAt;
}
