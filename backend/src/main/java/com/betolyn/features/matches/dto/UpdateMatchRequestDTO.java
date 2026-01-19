package com.betolyn.features.matches.dto;

import com.betolyn.features.matches.MatchStatusEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Optional;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateMatchRequestDTO {
    private Integer homeTeamScore;
    private Integer awayTeamScore;

    private String startTime;
    private String endTime;

    private MatchStatusEnum status;
}
