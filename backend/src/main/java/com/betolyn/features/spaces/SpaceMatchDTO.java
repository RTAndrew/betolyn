package com.betolyn.features.spaces;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.betolyn.features.matches.MatchDTO;

import lombok.Data;

@Data
public class SpaceMatchDTO {
    private String id;
    private String spaceId;
    private String matchId;
    private MatchDTO match;
    private BigDecimal reservedLiability;
    private BigDecimal maxReservedLiability;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
