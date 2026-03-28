package com.betolyn.features.spaces;

import java.time.LocalDateTime;

import com.betolyn.features.user.UserDTO;

import lombok.Data;

@Data
public class SpaceDTO {
    private String id;
    private String name;
    private String description;
    private UserDTO createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
