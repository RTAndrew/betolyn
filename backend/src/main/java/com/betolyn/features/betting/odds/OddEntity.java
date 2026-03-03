package com.betolyn.features.betting.odds;

import java.math.BigDecimal;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.features.betting.betslips.OddPriceAttributeConverter;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "odds")
public class OddEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean isWinner = false;

    @Column(nullable = false)
    private Integer totalBetsCount = 0;
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney totalStakesVolume = BetMoney.zero();
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney potentialPayoutVolume = BetMoney.zero();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "last_odd_history_id")
    @JsonIgnoreProperties("odd") // avoid self reference lastOdd <-> odd
    private OddHistoryEntity lastOddHistory;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = OddPriceAttributeConverter.class)
    private OddPrice value = new OddPrice(BigDecimal.valueOf(0.1));

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private OddStatusEnum status = OddStatusEnum.DRAFT;

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
