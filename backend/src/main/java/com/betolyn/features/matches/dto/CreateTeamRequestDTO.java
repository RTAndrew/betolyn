package com.betolyn.features.matches.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class CreateTeamRequestDTO {
    @NonNull
    private String name;
    private String badgeUrl;
}
