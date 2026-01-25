package com.betolyn.features.betting.criterion.updatecriterionstatus;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@JsonInclude(NON_NULL)
public record CriterionStatusChangedEventDTO(String criterionId, String matchId,  CriterionStatusEnum status, List<String> odds) {
}
