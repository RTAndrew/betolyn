package com.betolyn.features.betting.criterion;

public enum CriterionStatusEnum {
    DRAFT, // (only for Odd, used to prepare marketings/odds) // TODO: remove from OddHistory
    ACTIVE,
    SETTLED, // Hidden from Live Feed + Paid Out/Lost.
    EXPIRED, // Possibly updated (only for OddHistory)
    // // TODO: move to OddHistory (as archivd?)
    // the idea is that later on there may be timeout based on TIME
    // and number of bets made (total or during a certain period - hot bets)
    SUSPENDED, // Visible + Not Clickable (Locked)
    VOID, // Visible in History + Refunded
}
