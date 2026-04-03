package com.betolyn.shared.money;

import java.math.BigDecimal;
import java.math.RoundingMode;

import javax.money.Monetary;
import javax.money.MonetaryAmount;
import javax.money.MonetaryOperator;

import org.javamoney.moneta.Money;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public final class BetMoney {

    private static final String CURRENCY = "AOA";

    private static final MonetaryOperator ROUNDING =
            Monetary.getRounding(
                    Monetary.getCurrency(CURRENCY)
            );

    public static BetMoney of(double value) {
        return new BetMoney(Money.of(value, CURRENCY));
    }

    @JsonCreator
    public static BetMoney of(BigDecimal value) {
        if (value == null) {
            return zero();
        }
        return new BetMoney(Money.of(value, CURRENCY));
    }

    public static BetMoney zero() {
        return of(BigDecimal.ZERO);
    }

    private final MonetaryAmount amount;

    private BetMoney(MonetaryAmount amount) {
        this.amount = amount.with(ROUNDING);
    }

    @JsonValue
    public BigDecimal toBigDecimal() {
        return amount.getNumber().numberValueExact(BigDecimal.class);
    }

    public BetMoney add(BetMoney other) {
        return new BetMoney(this.amount.add(other.amount));
    }

    public BetMoney subtract(BetMoney other) {
        return new BetMoney(this.amount.subtract(other.amount));
    }

    public BetMoney multiply(BigDecimal multiplier) {
        return new BetMoney(this.amount.multiply(multiplier));
    }

    /**
     * Returns the ratio this / other using an explicit scale and rounding.
     */
    public BigDecimal divide(BetMoney other, int scale, RoundingMode roundingMode) {
        return this.toBigDecimal().divide(other.toBigDecimal(), scale, roundingMode);
    }

    /**
     * Returns the ratio this / other using the default scale and rounding
     * policy for percentages/ratios in this domain.
     */
    public BigDecimal divide(BetMoney other) {
        // Current policy: 4 decimal places, HALF_UP.
        return divide(other, 4, RoundingMode.HALF_UP);
    }

    public BetMoney negate() {
        return new BetMoney(this.amount.negate());
    }

    public boolean isGreaterThan(BetMoney other) {
        return this.amount.isGreaterThan(other.amount);
    }

    public boolean isGreaterOrEqual(BetMoney other) {
        return this.amount.isGreaterThanOrEqualTo(other.amount);
    }

    public boolean isLessThan(BetMoney other) {
        return this.amount.isLessThan(other.amount);
    }

    public boolean isLessThanOrEqual(BetMoney other) {
        return this.amount.isLessThanOrEqualTo(other.amount);
    }

    public boolean isZero() {
        return this.amount.isZero();
    }

    /** Returns the absolute value of this amount. */
    public BetMoney abs() {
        return of(this.toBigDecimal().abs());
    }
}
