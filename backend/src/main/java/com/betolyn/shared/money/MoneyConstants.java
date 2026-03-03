package com.betolyn.shared.money;

/**
 * Central constants for monetary column precision and scale.
 * Use in @Column, JPA converters, and DB migrations.
 */
public final class MoneyConstants {

    public static final int PRECISION = 19;
    public static final int SCALE = 2;

    private MoneyConstants() {
    }
}
