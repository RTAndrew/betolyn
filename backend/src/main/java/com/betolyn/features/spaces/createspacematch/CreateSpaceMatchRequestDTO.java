package com.betolyn.features.spaces.createspacematch;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateSpaceMatchRequestDTO {
    /** When set, links an existing platform match (auto / existing event flow). */
    private String matchId;

    /** Custom event: team names and schedule (required when matchId is blank). */
    private String homeTeamName;
    private String awayTeamName;
    private String startTime;
    private String endTime;

    private BigDecimal maxReservedLiability;
}
