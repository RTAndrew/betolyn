package com.betolyn.features.betting.betslips;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipTypeEnum;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "bet_slips")
public class BetSlipEntity extends AuditableEntity {

    @Column(precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    private BigDecimal totalCumulativeOdds;

    @Column(nullable = false)
    private Double totalItemsCount;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney totalStake;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney totalPotentialPayout;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BetSlipTypeEnum type = BetSlipTypeEnum.SINGLE;

    private String voidReason;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BetSlipStatusEnum status = BetSlipStatusEnum.PENDING;

    @NotNull
    @OneToMany(mappedBy = "betSlip", cascade = CascadeType.ALL)
    private List<BetSlipItemEntity> items = new ArrayList<>();

    @PreUpdate
    // Note: we do NOT use @PrePersist here because bet slips are created with
    // their ID generated and items populated before the initial save, and we
    // explicitly call updateProjections() from the use case once all values are
    // set.
    public void updateProjections() {
        var count = this.getItems().size();
        if (count == 0) {
            return;
        }

        setTotalItemsCount((double) count);

        BetMoney totalStakeSum = this.getItems().stream()
                .map(BetSlipItemEntity::getStake)
                .reduce(BetMoney.zero(), BetMoney::add);
        setTotalStake(totalStakeSum);

        BetMoney totalPayoutSum = this.getItems().stream()
                .map(BetSlipItemEntity::getPotentialPayout)
                .reduce(BetMoney.zero(), BetMoney::add);
        setTotalPotentialPayout(totalPayoutSum);
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "slip");
    }
}
