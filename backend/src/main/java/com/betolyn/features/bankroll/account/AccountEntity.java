package com.betolyn.features.bankroll.account;

import java.util.Objects;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "accounts")
public class AccountEntity extends BaseEntity {

    private static void requirePositiveAmount(BetMoney amount) {
        if (amount == null || !amount.isGreaterThan(BetMoney.zero())) {
            throw new BusinessRuleException("INVALID_AMOUNT", "Amount must be positive");
        }
    }

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private AccountOwnerTypeEnum ownerType;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney balanceAvailable = BetMoney.zero();

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney balanceReserved = BetMoney.zero();

    public AccountEntity(String ownerId, AccountOwnerTypeEnum ownerType, BetMoney balanceAvailable,
            BetMoney balanceReserved) {
        this.ownerId = ownerId;
        this.ownerType = ownerType;
        this.balanceAvailable = Objects.requireNonNullElse(balanceAvailable, BetMoney.zero());
        this.balanceReserved = Objects.requireNonNullElse(balanceReserved, BetMoney.zero());
    }

    /** Decreases {@link #balanceAvailable} after validating amount and funds. */
    public void debit(BetMoney amount) {
        requirePositiveAmount(amount);
        if (this.ownerType != AccountOwnerTypeEnum.SYSTEM && balanceAvailable.isLessThan(amount)) {
            throw new BusinessRuleException("INSUFFICIENT_AVAILABLE_BALANCE", "Insufficient available balance");
        }
        this.balanceAvailable = this.balanceAvailable.subtract(amount);
    }

    /** Increases {@link #balanceAvailable} after validating amount. */
    public void credit(BetMoney amount) {
        requirePositiveAmount(amount);
        this.balanceAvailable = this.balanceAvailable.add(amount);
    }

    /**
     * Moves amount from available to reserved.
     * Only USER and SPACE accounts may lock funds.
     */
    public void lockFunds(BetMoney amount) {
        requirePositiveAmount(amount);
        if (balanceAvailable.isLessThan(amount)) {
            throw new BusinessRuleException("INSUFFICIENT_AVAILABLE_BALANCE", "Insufficient available balance");
        }
        this.balanceAvailable = this.balanceAvailable.subtract(amount);
        this.balanceReserved = this.balanceReserved.add(amount);
    }

    /** Moves amount from reserved to available. */
    public void releaseFunds(BetMoney amount) {
        requirePositiveAmount(amount);
        if (balanceReserved.isLessThan(amount)) {
            throw new BusinessRuleException("INSUFFICIENT_RESERVED_BALANCE_TO_RELEASE",
                    "Insufficient reserved balance to release");
        }
        this.balanceAvailable = this.balanceAvailable.add(amount);
        this.balanceReserved = this.balanceReserved.subtract(amount);
    }

    /**
     * Consumes reserved funds permanently (e.g. losing a bet) without returning
     * them to available balance.
     * Only available to USER and SPACE accounts.
     */
    public void consumeReservedStake(BetMoney amount) {
        requirePositiveAmount(amount);
        if (this.ownerType == AccountOwnerTypeEnum.SYSTEM) {
            throw new BusinessRuleException("INVALID_ACCOUNT_TYPE",
                    "System accounts cannot consume reserved stake via this operation");
        }
        if (balanceReserved.isLessThan(amount)) {
            throw new BusinessRuleException("INSUFFICIENT_RESERVED_BALANCE_TO_CONSUME",
                    "Insufficient reserved balance to consume");
        }
        this.balanceReserved = this.balanceReserved.subtract(amount);
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "acc");
    }
}
