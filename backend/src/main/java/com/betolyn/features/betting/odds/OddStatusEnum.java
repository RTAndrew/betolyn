package com.betolyn.features.betting.odds;

import java.util.function.Supplier;

/** Some states may not make sense to be available
 * in OddHistory (DRAFT). However, it must
 * because it serves to track when the values where created.
 * The most recent OddHistory represents the actual present Odd*/
public enum OddStatusEnum {
    DRAFT, // (only for Odd, used to prepare markets/odds)
    ACTIVE,
    SETTLED, // Hidden from Live Feed + Paid Out/Lost.
    EXPIRED, // Possibly updated (only for OddHistory)
    SUSPENDED, // Visible + Not Clickable (Locked)
    VOID, // Visible in History + Refunded
}
