package com.betolyn.shared;

import java.math.BigDecimal;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.shared.money.BetMoney;

/**
 * Centralized conversions between domain money types and transport types.
 */
@Component
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

