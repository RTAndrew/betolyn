package com.betolyn.features.matches.matchSystemEvents;

public record MatchScoreChangedEventDTO(String matchId, int homeTeamScore, int awayTeamScore) {
}
