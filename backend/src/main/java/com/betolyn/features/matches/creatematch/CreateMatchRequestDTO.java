package com.betolyn.features.matches.creatematch;

import lombok.Data;

@Data
public class CreateMatchRequestDTO {

    //    private String channelId;

//    private String criteriaHighlightId;

//    private String homeTeamName;
    private String homeTeamId;
    private int homeTeamScore = 0;

//    private String awayTeamName;
    private String awayTeamId;
    private int awayTeamScore = 0;

    private String startTime;
    private String endTime;
}
