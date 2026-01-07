package com.betolyn.features.betting.criterion;

import com.betolyn.features.matches.MatchEntity;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "criteria")
public class CriterionEntity extends BaseEntity {
    @NotNull
    private String name;
    @NotNull
    private boolean allowMultipleOdds = true;

    @Column(nullable = false) // it's optional to pass it as param
    private boolean isStandalone;

    @ManyToOne
    @JoinColumn(name = "match_entity_id")
    private MatchEntity match;

    /** Ensures that the flag "isStandalone" is properly saved
     * at DB level and accessed by external APIs,
     * without relying on DTO mappers.
     */
    @PrePersist
    @PreUpdate
    private void checkIfStandalone() {
        if(this.match == null) {
            this.setIsStandalone(true);
        }
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "crit");
    }
}
