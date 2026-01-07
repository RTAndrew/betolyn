package com.betolyn.features.betting.odds;

import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "odds_history")
public class OddHistoryEntity extends AuditableEntity {
    @OneToOne(orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name="odd_id")
    private OddEntity odd;

    private String updateReason;

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

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(15, "oddhist");
    }
}
