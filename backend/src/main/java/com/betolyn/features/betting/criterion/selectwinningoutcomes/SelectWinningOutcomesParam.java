package com.betolyn.features.betting.criterion.selectwinningoutcomes;

import java.util.List;

public record SelectWinningOutcomesParam(String criterionId, List<WinningOutcomeItemDTO> odds) {
}
