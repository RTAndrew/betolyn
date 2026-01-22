package com.betolyn.features.matches.updatematchscore;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateMatchScoreRequestDTO {
    private Integer homeTeamScore;
    private Integer awayTeamScore;
}
