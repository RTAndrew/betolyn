package com.betolyn.features.matches.DTOs;

import lombok.Data;
import lombok.NonNull;

@Data
public class CreateTeamRequestDTO {
    @NonNull
    private String name;
    private String badgeUrl;
}
