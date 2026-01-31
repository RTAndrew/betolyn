package com.betolyn.features.bankroll.transaction.mintcredits;

import com.betolyn.features.user.UserEntity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Parameters for minting credits (Global → User).
 * <p>
 * When createdBy is present (e.g. signup flow), it is set on the transaction for audit.
 * When empty (e.g. logged-in user buying credits), leave null so auditing can be
 * handled automatically (e.g. Auditable / security context).
 * </p>
 */
@Getter
@RequiredArgsConstructor
public class MintCreditsParam {
    /** The user receiving the credits (must already have an account). */
    private final UserEntity user;
    /** The amount to mint. */
    private final BigDecimal amount;
    /** Memo for the transaction (e.g. "Initial credits", "Credit purchase"). */
    private final String memo;
    /** Optional user to set as createdBy on the transaction; empty when caller is logged in. */
    private final Optional<UserEntity> createdBy;
}
