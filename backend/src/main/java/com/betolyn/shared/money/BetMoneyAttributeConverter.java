package com.betolyn.shared.money;

import java.math.BigDecimal;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * DB column converter for BetMoney type.
 */
@Converter(autoApply = false)
public class BetMoneyAttributeConverter implements AttributeConverter<BetMoney, BigDecimal> {

    @Override
    public BigDecimal convertToDatabaseColumn(BetMoney attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.toBigDecimal();
    }

    @Override
    public BetMoney convertToEntityAttribute(BigDecimal dbData) {
        if (dbData == null) {
            return null;
        }
        return BetMoney.of(dbData);
    }
}
