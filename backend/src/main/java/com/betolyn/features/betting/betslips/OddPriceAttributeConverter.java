package com.betolyn.features.betting.betslips;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.math.BigDecimal;

@Converter(autoApply = false)
public class OddPriceAttributeConverter implements AttributeConverter<OddPrice, BigDecimal> {

    @Override
    public BigDecimal convertToDatabaseColumn(OddPrice attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.toBigDecimal();
    }

    @Override
    public OddPrice convertToEntityAttribute(BigDecimal dbData) {
        if (dbData == null) {
            return null;
        }
        return new OddPrice(dbData);
    }
}
