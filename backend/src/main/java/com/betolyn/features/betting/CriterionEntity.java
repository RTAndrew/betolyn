package com.betolyn.features.betting;

import com.betolyn.features.matches.MatchEntity;
import com.betolyn.shared.BaseEntity;
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
    @JoinColumn(name = "match_entity_id", nullable = true)
    private MatchEntity match;

    /** Ensures that the flag "isStandalone" is properly saved
     * at DB level and accessed by external APIs,
     * without relying on DTO mappers.
     */
    private void checkIfStandalone() {
        if(this.match == null) {
            this.setIsStandalone(true);
        }
    }

    @PrePersist
    protected void onCreate() {
        this.checkIfStandalone();
    }


    @PreUpdate
    protected void onUpdate() {
        this.checkIfStandalone();
    }
}
