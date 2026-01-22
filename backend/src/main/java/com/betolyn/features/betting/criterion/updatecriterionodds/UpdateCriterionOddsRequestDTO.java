package com.betolyn.features.betting.criterion.updatecriterionodds;

import com.betolyn.features.betting.odds.OddStatusEnum;
import lombok.Data;

import java.util.List;

@Data
public class UpdateCriterionOddsRequestDTO {
    public record CriterionOdd(String id, double value, OddStatusEnum status) {}

    private List<CriterionOdd> odds;
}
