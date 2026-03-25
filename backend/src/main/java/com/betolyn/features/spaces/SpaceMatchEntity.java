package com.betolyn.features.spaces;

import com.betolyn.features.matches.MatchEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "space_matches",
        uniqueConstraints = {
                @UniqueConstraint(name = "UniqueMatchIdAndSpaceId", columnNames = { "match_id", "space_id" }) }
)
public class SpaceMatchEntity extends AuditableEntity {
    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;

    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private SpaceEntity space;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney reservedLiability = BetMoney.zero();
    @Column(precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney maxReservedLiability = null;


    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "spamatch");
    }
}
