package com.betolyn.features.bankroll.transaction;

/**
 * Kind of movement within a {@link TransactionEntity} (one leg / line item).
 */
public enum TransactionItemTypeEnum {

  /** User → Escrow. */
  STAKE_ESCROW,

  /** Space available → Space reserved (liability lock). */
  LIABILITY_RESERVE,

  // --- Settlement (MATCH_SETTLEMENT) ---

  /** Escrow → User. Return of original stake. */
  WIN_PAYOUT_STAKE,

  /**
   * Space reserved → User (or global reserve → User when not space-owned).
   * Win profit.
   */
  WIN_PAYOUT_PROFIT,

  /** Escrow → Space available. Losing stake retained by the space. */
  LOSS_COLLECTION,

  /** Space reserved → Space available. Unused risk released after settlement. */
  RESERVE_RELEASE
}
