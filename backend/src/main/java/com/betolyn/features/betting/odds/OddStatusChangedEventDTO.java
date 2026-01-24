package com.betolyn.features.betting.odds;

import java.util.List;

public record OddStatusChangedEventDTO(List<String> odds, OddStatusEnum status) {
}
