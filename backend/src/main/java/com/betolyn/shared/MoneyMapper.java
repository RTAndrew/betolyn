package com.betolyn.shared;

import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.shared.money.BetMoney;
import org.mapstruct.Named;

import java.math.BigDecimal;

/**
 * Centralized conversions between domain money types and transport types.
 */
public class MoneyMapper {

    public static BigDecimal betMoneyToBigDecimal(BetMoney money) {
        return money != null ? money.toBigDecimal() : null;
    }

    public static BetMoney bigDecimalToBetMoney(BigDecimal value) {
        return value != null ? BetMoney.of(value) : null;
    }

    public static BigDecimal oddPriceToBigDecimal(OddPrice price) {
        return price != null ? price.toBigDecimal() : null;
    }

    /**
     * MapStruct-friendly instance variants, qualified by name, delegating to the static helpers above.
     */
    @Named("betMoneyToBigDecimal")
    public BigDecimal betMoneyToBigDecimalNamed(BetMoney money) {
        return betMoneyToBigDecimal(money);
    }

    @Named("bigDecimalToBetMoney")
    public BetMoney bigDecimalToBetMoneyNamed(BigDecimal value) {
        return bigDecimalToBetMoney(value);
    }

    @Named("oddPriceToBigDecimal")
    public BigDecimal oddPriceToBigDecimalNamed(OddPrice price) {
        return oddPriceToBigDecimal(price);
    }
}

