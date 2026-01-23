package com.betolyn.features.teams.teamSystemEvents;

import com.betolyn.features.teams.TeamEntity;

public record TeamCreatedEventDTO(String teamId, TeamEntity team) {
}
