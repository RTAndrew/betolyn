package com.betolyn.features.bankroll.account;

import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.exceptions.BusinessRuleException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
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
@Table(name = "accounts")
public class AccountEntity extends BaseEntity {

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private AccountOwnerTypeEnum ownerType;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balanceAvailable = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balanceReserved = BigDecimal.ZERO;

    public AccountEntity(String ownerId, AccountOwnerTypeEnum ownerType, BigDecimal balanceAvailable,
            BigDecimal balanceReserved) {
        this.ownerId = ownerId;
        this.ownerType = ownerType;
        this.balanceAvailable = balanceAvailable != null ? balanceAvailable : BigDecimal.ZERO;
        this.balanceReserved = balanceReserved != null ? balanceReserved : BigDecimal.ZERO;
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "acc");
    }

    /**
     * Moves amount from available to reserved. Only USER and CHANNEL accounts may
     * lock funds.
     *
     * @throws BusinessRuleException if ownerType is SYSTEM or amount is not positive or exceeds available balance
     */
    public void lockFunds(BigDecimal amount) {
        if (ownerType == AccountOwnerTypeEnum.SYSTEM) {
            throw new BusinessRuleException("SYSTEM_ACCOUNT_LOCK_FUNDS_NOT_ALLOWED","SYSTEM accounts cannot lock funds");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("INVALID_AMOUNT","Amount must be positive");
        }
        if (balanceAvailable.compareTo(amount) < 0) {
            throw new BusinessRuleException("INSUFFICIENT_AVAILABLE_BALANCE","Insufficient available balance");
        }
        this.balanceAvailable = this.balanceAvailable.subtract(amount);
        this.balanceReserved = this.balanceReserved.add(amount);
    }
}
