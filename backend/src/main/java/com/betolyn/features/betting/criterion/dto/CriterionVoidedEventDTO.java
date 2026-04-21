package com.betolyn.features.betting.criterion.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(NON_NULL)
public record CriterionVoidedEventDTO(String criterionId, String matchId,
    String reason, List<String> odds) {
}
