package com.betolyn.features.matches.matchSystemEvents;

import java.time.LocalDateTime;

public record MatchSettledEventDTO(String matchId, LocalDateTime settledAt) {
}
