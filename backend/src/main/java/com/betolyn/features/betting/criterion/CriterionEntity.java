package com.betolyn.features.betting.criterion;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.shared.baseEntity.BaseEntity;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
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
@Table(name = "criteria")
public class CriterionEntity extends BaseEntity {
    @NotNull
    private String name;

    @Column(nullable = false)
    private Integer totalBetsCount = 0;
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney totalStakesVolume = BetMoney.zero();
    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney reservedLiability = BetMoney.zero();
    @Column(precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney maxReservedLiability = null;

    @NotNull
    private Boolean allowMultipleWinners = false;

    @NotNull
    private boolean allowMultipleOdds = true;

    @Column(nullable = false)
    private boolean isStandalone;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private CriterionStatusEnum status;

    @ManyToOne
    @JoinColumn(name = "match_entity_id")
    private MatchEntity match;

    @OneToMany(mappedBy = "criterion", cascade = CascadeType.ALL)
    private List<OddEntity> odds = new ArrayList<>();

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "crit");
    }

    /**
     * Ensures that the flag "isStandalone" is properly saved
     * at DB level and accessed by external APIs,
     * without relying on DTO mappers.
     */
    @PrePersist
    @PreUpdate
    private void checkIfStandalone() {
        if (this.match == null) {
            this.setIsStandalone(true);
        } else {
            this.setIsStandalone(false);
        }
    }
}
