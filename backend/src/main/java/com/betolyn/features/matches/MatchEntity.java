package com.betolyn.features.matches;

import com.betolyn.features.auth.UserEntity;
import com.betolyn.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "matches")
public class MatchEntity extends BaseEntity {

    private boolean isOfficial = true;
    private String channelId;

    private String criteriaHighlightId;

    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private TeamEntity homeTeam;
    private String homeTeamName;
    private int homeTeamScore = 0;

    @ManyToOne
    @JoinColumn(name = "away_team_id")
    private TeamEntity awayTeam;
    private String awayTeamName;
    private int awayTeamScore = 0;

    private String startTime;
    private String endTime;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private UserEntity user;
}
