package com.betolyn.features.matches;

import java.time.LocalDateTime;
import java.util.Objects;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.teams.TeamEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "matches", uniqueConstraints = {
        @UniqueConstraint(name = "unique_space_official_derived", columnNames = { "space_id", "official_match_id" })
})
public class MatchEntity extends AuditableEntity {

    /** ESPN event id for feed sync / dedupe (nullable for legacy rows). */
    @Column(name = "espn_id", unique = true, length = 64)
    private String espnId;

    @Column(name = "venue_name", length = 300)
    private String venueName;

    @Column(name = "match_type", nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private MatchTypeEnum type = MatchTypeEnum.OFFICIAL;

    /**
     * Space-scoped link for {@link MatchTypeEnum#CUSTOM} and
     * {@link MatchTypeEnum#DERIVED}.
     * Must be null for {@link MatchTypeEnum#OFFICIAL}.
     */
    @Column(updatable = false)
    private String spaceId;

    /**
     * Points at the feed-backed match; only set for {@link MatchTypeEnum#DERIVED}.
     * Must reference a row with {@link #type} {@link MatchTypeEnum#OFFICIAL}.
     */
    @ManyToOne()
    @JoinColumn(name = "official_match_id")
    @JsonIgnoreProperties({
            "homeTeam",
            "awayTeam",
            "mainCriterion",
            "officialMatch",
            "createdBy",
            "updatedBy",
            "hibernateLazyInitializer",
            "handler"
    })
    private MatchEntity officialMatch;

    private String startTime;
    private String endTime;

    /** The worst-scenario (risk) among all criteria */
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney reservedLiability = BetMoney.zero();

    /** The maximum worst-scenario (risk) ceiling acceptable */
    @Column(precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney maxReservedLiability = null;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private MatchStatusEnum status = MatchStatusEnum.SCHEDULED;

    /**
     * Lazy so list endpoints (e.g. space events) can skip loading criteria/odds for
     * merged official data.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criteria_highlight_id")
    @JsonIgnoreProperties({ "odds", "match" })
    private CriterionEntity mainCriterion;

    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private TeamEntity homeTeam;
    private int homeTeamScore = 0;

    @ManyToOne
    @JoinColumn(name = "away_team_id")
    private TeamEntity awayTeam;
    private int awayTeamScore = 0;

    /** Set when match-level settlement has completed (including no pending bets). */
    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    public boolean isSpaceOwned() {
        return Objects.nonNull(spaceId);
    }

    /**
     * Lifecycle / display status: {@link MatchTypeEnum#OFFICIAL} and {@link MatchTypeEnum#CUSTOM} use this
     * row's {@link #status}. {@link MatchTypeEnum#DERIVED} follows the linked official match when present
     * (feed-backed truth), except when this row is {@link MatchStatusEnum#CANCELLED} (e.g. match void in a
     * space), which takes precedence over the official fixture.
     */
    public MatchStatusEnum getEffectiveStatus() {
        if (type != MatchTypeEnum.DERIVED) {
            return status;
        }

        if (officialMatch == null) {
            return status;
        }

        if (status == MatchStatusEnum.CANCELLED) {
            return MatchStatusEnum.CANCELLED;
        }

        return officialMatch.getStatus();
    }

    /**
     * Human-readable fixture title for UI and transaction snapshots (not persisted).
     * For {@link MatchTypeEnum#DERIVED}, uses the linked official match's teams, consistent with
     * {@link com.betolyn.features.matches.MatchDtoAssembler}.
     */
    public String getDisplayName() {
        if (type == MatchTypeEnum.DERIVED && officialMatch != null) {
            return titleFromTeams(officialMatch.getHomeTeam(), officialMatch.getAwayTeam());
        }
        return titleFromTeams(homeTeam, awayTeam);
    }

    private static String titleFromTeams(TeamEntity home, TeamEntity away) {
        if (home != null && away != null) {
            return home.getName() + " vs " + away.getName();
        }
        if (home != null) {
            return home.getName();
        }
        if (away != null) {
            return away.getName();
        }
        return null;
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "match");
    }
}
