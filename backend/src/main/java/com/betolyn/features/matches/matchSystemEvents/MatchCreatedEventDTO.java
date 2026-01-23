package com.betolyn.features.matches.matchSystemEvents;

import com.betolyn.features.matches.MatchDTO;

public record MatchCreatedEventDTO(String matchId, MatchDTO match) {
}
