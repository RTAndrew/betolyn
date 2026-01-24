package com.betolyn.features.betting.odds;

public record OddStatusChangedEventDTO(String oddId, OddStatusEnum status) {
}
