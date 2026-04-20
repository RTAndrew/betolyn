package com.betolyn.features.bankroll.transaction;

/**
 * Kind of movement within a {@link TransactionEntity} (one leg / line item).
 */
public enum TransactionItemTypeEnum {

  /** User → Escrow. */
  STAKE_ESCROW_LOCK,

  /** Escrow → User (VOID). */
  STAKE_ESCROW_REFUND,

  /** Space available → Space reserved (liability lock). */
  LIABILITY_RESERVE,
  /** Space reserved → Space available. Unused risk released after settlement. */
  LIABILITY_RELEASE,

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

}
