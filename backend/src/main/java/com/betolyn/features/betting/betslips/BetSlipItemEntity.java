package com.betolyn.features.betting.betslips;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddHistoryEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "bet_slip_items")
public class BetSlipItemEntity extends AuditableEntity {
    @Column(nullable = false)
    private String matchId;
    @Column(nullable = false)
    private String criterionId;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney stake;
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney potentialPayout;
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = OddPriceAttributeConverter.class)
    private OddPrice oddValueAtPlacement;

    private String voidReason;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BetSlipItemStatusEnum status = BetSlipItemStatusEnum.PENDING;

    @ManyToOne
    @JoinColumn(name = "odd_id", nullable = false)
    private OddEntity odd;

    @ManyToOne
    @JoinColumn(name = "odd_history_id", nullable = false)
    private OddHistoryEntity oddHistory;

    @ManyToOne
    @JoinColumn(name = "bet_slip_id", nullable = false)
    private BetSlipEntity betSlip;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "slipi");
    }
}
