package com.betolyn.features.bankroll;

public final class BankrollConstants {

    public static final String GLOBAL_ESCROW_ACCOUNT = "GLOBAL_ESCROW_ACCOUNT";
    public static final String GLOBAL_RESERVE_ACCOUNT = "GLOBAL_RESERVE_ACCOUNT";

    /** Initial credits minted for new users on signup. Equivant to $500.000 or 500.000 AOA (Angolan Kwanza) */
    public static final java.math.BigDecimal INITIAL_MINT_AMOUNT = new java.math.BigDecimal("500000");

    private BankrollConstants() {
    }
}
