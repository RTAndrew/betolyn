package com.betolyn.features.betting.betslips;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import java.util.Optional;

public interface BetSlipItemRepository extends JpaRepository<BetSlipItemEntity, String> {
    @Query("""
            SELECT i FROM BetSlipItemEntity i
            JOIN i.betSlip bs
            JOIN FETCH i.odd o
            JOIN FETCH o.criterion c
            JOIN FETCH c.match
            LEFT JOIN FETCH i.oddHistory
            WHERE i.id = :id
            AND bs.createdBy.id = :createdById
            """)
    Optional<BetSlipItemEntity> findByIdAndOwnerId(
            @Param("id") String id,
            @Param("createdById") String createdById);

    @Query("""
            SELECT COALESCE(SUM(i.potentialPayout), 0) FROM BetSlipItemEntity i
            WHERE i.criterionId = :criterionId AND i.status = :status
            """)
    BigDecimal sumPotentialPayoutByCriterionIdAndStatus(
            @Param("criterionId") String criterionId,
            @Param("status") BetSlipItemStatusEnum status);

    @Query(value = """
            SELECT COALESCE(SUM(i.stake), 0) FROM bet_slip_items i
            WHERE i.odd_id = :oddId AND i.status <> 'VOIDED'
            """, nativeQuery = true)
    BigDecimal sumStakeByOddIdExcludingVoided(@Param("oddId") String oddId);

    @Query(value = """
            SELECT COALESCE(SUM(i.potential_payout), 0) FROM bet_slip_items i
            WHERE i.odd_id = :oddId AND i.status = 'WON'
            """, nativeQuery = true)
    BigDecimal sumPotentialPayoutByOddIdWhereWon(@Param("oddId") String oddId);

    @Query(value = """
            SELECT COALESCE(SUM(i.stake), 0) FROM bet_slip_items i
            WHERE i.criterion_id = :criterionId AND i.status <> 'VOIDED'
            """, nativeQuery = true)
    BigDecimal sumStakeByCriterionIdExcludingVoided(@Param("criterionId") String criterionId);

    @Query("""
            SELECT AVG(i.stake) FROM BetSlipItemEntity i
            WHERE i.odd.id = :oddId
            """)
    BigDecimal averageStakeByOddId(@Param("oddId") String oddId);

    @Query("""
            SELECT DISTINCT i FROM BetSlipItemEntity i
            JOIN FETCH i.betSlip
            JOIN FETCH i.odd o
            JOIN FETCH o.criterion
            WHERE i.matchId = :matchId
            AND i.betSlip.status = :slipStatus
            AND i.status = :itemStatus
            AND o.status = com.betolyn.features.betting.odds.OddStatusEnum.SUSPENDED

            """)
    List<BetSlipItemEntity> findAllByMatchIdAndBetSlipStatusAndStatus(
            @Param("matchId") String matchId,
            @Param("slipStatus") BetSlipStatusEnum slipStatus,
            @Param("itemStatus") BetSlipItemStatusEnum itemStatus);

    /**
     * Returns (sum of stake from items for match where criterion is SETTLED and
     * item is not VOIDED, sum of potentialPayout for WON items for match).
     * Used to compute match-level realized P/L = stakes - payouts (null when no
     * settled criteria).
     * EXISTS is required so we only count stakes on settled criteria; otherwise we
     * would include stakes on PENDING criteria and distort match P/L.
     */
    @Query(value = """
            SELECT (SELECT COALESCE(SUM(i.stake), 0) FROM bet_slip_items i WHERE i.match_id = :matchId AND i.status <> 'VOIDED' AND EXISTS (SELECT 1 FROM criteria c WHERE c.id = i.criterion_id AND c.match_entity_id = :matchId AND c.status = 'SETTLED')),
                   (SELECT COALESCE(SUM(i.potential_payout), 0) FROM bet_slip_items i WHERE i.match_id = :matchId AND i.status = 'WON')
            """, nativeQuery = true)
    List<Object[]> getSettledMatchStakesAndPayouts(@Param("matchId") String matchId);
}
