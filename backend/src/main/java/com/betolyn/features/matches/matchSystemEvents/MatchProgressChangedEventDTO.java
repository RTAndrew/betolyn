package com.betolyn.features.matches.matchSystemEvents;

import com.betolyn.features.matches.MatchStatusEnum;

public record MatchProgressChangedEventDTO(String matchId, MatchStatusEnum previousStatus, MatchStatusEnum newStatus) {
}
