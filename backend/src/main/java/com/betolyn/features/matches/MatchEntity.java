package com.betolyn.features.matches;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "matches")
public class MatchEntity extends AuditableEntity {

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

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "match");
    }
}
