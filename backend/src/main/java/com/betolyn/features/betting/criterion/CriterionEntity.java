package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "criteria")
public class CriterionEntity extends BaseEntity {
    @NotNull
    private String name;

    @Column(nullable = false)
    private Double totalBetsCount = 0.0;
    @Column(nullable = false)
    private Double totalStakesVolume = 0.0;
    @Column(nullable = false)
    private Double reservedLiability = 0.0;
    private Double maxReservedLiability = null;

    @NotNull
    private Boolean allowMultipleWinners = false;

    @NotNull
    private boolean allowMultipleOdds = true;

    @Column(nullable = false)
    private boolean isStandalone;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private CriterionStatusEnum status;

    @ManyToOne
    @JoinColumn(name = "match_entity_id")
    private MatchEntity match;

    @OneToMany(mappedBy = "criterion", cascade = CascadeType.ALL)
    private List<OddEntity> odds = new ArrayList<>();

    /**
     * Ensures that the flag "isStandalone" is properly saved
     * at DB level and accessed by external APIs,
     * without relying on DTO mappers.
     */
    @PrePersist
    @PreUpdate
    private void checkIfStandalone() {
        if (this.match == null) {
            this.setIsStandalone(true);
        }
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "crit");
    }
}
