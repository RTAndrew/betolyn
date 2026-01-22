package com.betolyn.features.matches;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "matches")
public class MatchEntity extends AuditableEntity {

    private boolean isOfficial = true;
    private String channelId;

    private String startTime;
    private String endTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private MatchStatusEnum status = MatchStatusEnum.SCHEDULED;

    @OneToOne
    @JoinColumn(name = "criteria_highlight_id")
    @JsonIgnoreProperties({"odds", "match"})
    private CriterionEntity mainCriterion;

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

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "match");
    }
}
