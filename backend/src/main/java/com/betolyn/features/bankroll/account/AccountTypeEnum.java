package com.betolyn.features.bankroll.account;

/**
 * Type of account leg in a transaction item (from/to).
 */
public enum AccountTypeEnum {
    USER_WALLET,
    CHANNEL_AVAILABLE,
    CHANNEL_RESERVED,
    GLOBAL,
    GLOBAL_ESCROW
}
