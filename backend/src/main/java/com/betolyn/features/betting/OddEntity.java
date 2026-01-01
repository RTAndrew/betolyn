package com.betolyn.features.betting;

import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "odds")
public class OddEntity extends BaseEntity {

    @NotNull
    private String name;

    @NotNull
    private double value = 0.1;

    @NotNull
    private double minimumAmount;

    @NotNull
    private double maximumAmount;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "criterion_id")
    private CriterionEntity criterion;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "od");
    }
}
