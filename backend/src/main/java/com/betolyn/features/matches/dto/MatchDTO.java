package com.betolyn.features.matches.dto;
import com.betolyn.features.matches.TeamEntity;
import com.betolyn.features.user.UserDTO;
import lombok.Data;

@Data
public class MatchDTO {
    private String id;
    private TeamEntity homeTeam;
    private String homeTeamName;
    private int homeTeamScore;

    private TeamEntity awayTeam;
    private String awayTeamName;
    private int awayTeamScore;

    private String startTime;
    private String endTime;
    private UserDTO createdBy;
    private UserDTO updatedBy;
}
