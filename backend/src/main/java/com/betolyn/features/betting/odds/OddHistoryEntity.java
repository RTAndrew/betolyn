package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.features.betting.betslips.OddPriceAttributeConverter;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.MoneyConstants;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "odds_history")
public class OddHistoryEntity extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="odd_id")
    private OddEntity odd;

    private String updateReason;

    @NotNull
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = OddPriceAttributeConverter.class)
    private OddPrice value = new OddPrice(BigDecimal.valueOf(0.1));

    @NotNull
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private OddStatusEnum status;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(15, "oddhist");
    }
}
