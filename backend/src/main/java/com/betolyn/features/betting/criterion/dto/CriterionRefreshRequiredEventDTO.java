package com.betolyn.features.betting.criterion.dto;

import java.util.List;

public record CriterionRefreshRequiredEventDTO(String criterionId, String matchId, List<String> odds) {
}
