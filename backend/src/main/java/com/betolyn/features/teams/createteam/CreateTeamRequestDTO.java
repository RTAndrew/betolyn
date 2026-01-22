package com.betolyn.features.teams.createteam;

import lombok.Data;
import lombok.NonNull;

@Data
public class CreateTeamRequestDTO {
    @NonNull
    private String name;
    private String badgeUrl;
}
