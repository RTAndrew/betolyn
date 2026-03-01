package com.betolyn.features.betting.criterion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CriterionProfitAndLossDTO {
    /** Potential P/L (worst case): Total Stakes - max(All Potential Payouts); derived from reservedLiability. */
    private Double potentialPL;
    /** Realized P/L (after settlement): Total Stakes - Total Amount Paid to Winners; null when not settled. */
    private Double realizedPL;
}
