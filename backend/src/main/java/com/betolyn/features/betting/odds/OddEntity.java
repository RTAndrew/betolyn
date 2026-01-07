package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "odds")
public class OddEntity extends BaseEntity {

    @NotNull
    private String name;

    @OneToOne(mappedBy = "odd")
    @JoinColumn(name = "last_odd_history_id")
    @JsonIgnoreProperties("odd") // avoid self reference lastOdd <-> odd
    private OddHistoryEntity lastOddHistory;

    @NotNull
    private double value = 0.1;

    @NotNull
    private double minimumAmount;

    @NotNull
    private double maximumAmount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private OddStatusEnum status;

    @NotNull
    @ManyToOne
    @JsonIgnoreProperties("match")
    @JoinColumn(name = "criterion_id")
    private CriterionEntity criterion;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "od");
    }
}
