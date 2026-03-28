package com.betolyn.features.matches.creatematch;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateMatchRequestDTO {

    private String homeTeamId;
    private int homeTeamScore = 0;

    private String awayTeamId;
    private int awayTeamScore = 0;

    private String startTime;
    private String endTime;

    /** When creating a match for a space (custom event); also drives {@code isOfficial}. */
    private String spaceId;

    /** Cap for this match when created in a space context; optional for generic {@code POST /matches}. */
    private BigDecimal maxReservedLiability;
}
