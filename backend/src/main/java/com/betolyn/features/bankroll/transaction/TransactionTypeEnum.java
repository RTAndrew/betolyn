package com.betolyn.features.bankroll.transaction;

/**
 * Type of a ledger transaction.
 * <ul>
 *   <li>{@link #TRANSFER} – User A → User B (e.g. gifting credits).</li>
 *   <li>{@link #CHANNEL_FUNDING} – User (personal) → Channel. Funding a channel with personal credits.</li>
 *   <li>{@link #MINT_CREDITS} – Global → User. "Creation" of money (e.g. initial credits on signup, or user buying credits).</li>
 *   <li>{@link #BET_PLACEMENT} – Triggers stake lock + reserve lock.</li>
 *   <li>{@link #MARKET_SETTLEMENT} – Settlement for one market/criterion (use "market" as the financial term).</li>
 *   <li>{@link #MARKET_VOID} – Cancel one market/criterion.</li>
 *   <li>{@link #MATCH_VOID} – Bulk void for all markets in a match.</li>
 *   <li>{@link #VOID_REVERSAL} – Reversal of a void (use with care; often you re-settle instead of "reversing a void").</li>
 *   <li>{@link #PLATFORM_FEE_COLLECTION} – Platform fee collection.</li>
 *   <li>{@link #CHANNEL_WITHDRAW} – Channel → User (personal). When an admin withdraws profit from the house.</li>
 * </ul>
 */
public enum TransactionTypeEnum {
    /** User A → User B (e.g. gifting credits). */
    TRANSFER,

    /** User (personal) → Channel. */
    CHANNEL_FUNDING,

    /** Global → User. Creation of money (signup initial credits, or user buying credits). */
    MINT_CREDITS,

    /** Triggers stake lock + reserve lock. */
    BET_PLACEMENT,

    /** Settlement for one market/criterion. */
    MARKET_SETTLEMENT,

    /** Cancel one market/criterion. */
    MARKET_VOID,

    /** Bulk void for all markets in a match. */
    MATCH_VOID,

    /** Reversal of a void. Use with care; consider re-settling instead. */
    VOID_REVERSAL,

    /** Platform fee collection. */
    PLATFORM_FEE_COLLECTION,

    /** Channel → User (personal). Admin withdrawing profit from the house. */
    CHANNEL_WITHDRAW
}
