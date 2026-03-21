package com.betolyn.features.betting.odds.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;

public record OddCreatedEventDTO(String oddId, String criterionId, String matchId, OddStatusEnum status) {
}
