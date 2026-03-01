package com.betolyn.features.betting.betslips;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BetSlipItemRepository extends JpaRepository<BetSlipItemEntity, String> {

    @Query("""
            SELECT COALESCE(SUM(i.potentialPayout), 0) FROM BetSlipItemEntity i
            WHERE i.criterionId = :criterionId AND i.status = :status
            """)
    Double sumPotentialPayoutByCriterionIdAndStatus(
            @Param("criterionId") String criterionId,
            @Param("status") BetSlipItemStatusEnum status);

    @Query("""
            SELECT AVG(i.stake) FROM BetSlipItemEntity i
            WHERE i.odd.id = :oddId
            """)
    Double averageStakeByOddId(@Param("oddId") String oddId);

    @Query("""
            SELECT DISTINCT i FROM BetSlipItemEntity i
            JOIN FETCH i.betSlip
            JOIN FETCH i.odd o
            JOIN FETCH o.criterion
            WHERE i.matchId = :matchId
            AND i.betSlip.status = :slipStatus
            AND i.status = :itemStatus
            """)
    List<BetSlipItemEntity> findAllByMatchIdAndBetSlipStatusAndStatus(
            @Param("matchId") String matchId,
            @Param("slipStatus") BetSlipStatusEnum slipStatus,
            @Param("itemStatus") BetSlipItemStatusEnum itemStatus);

    /**
     * Returns (sum of totalStakesVolume of SETTLED criteria for match, sum of potentialPayout for WON items for match).
     * Used to compute match-level realized P/L = stakes - payouts (null when no settled criteria).
     */
    @Query(value = """
            SELECT (SELECT COALESCE(SUM(c.total_stakes_volume), 0) FROM criteria c WHERE c.match_entity_id = :matchId AND c.status = 'SETTLED'),
                   (SELECT COALESCE(SUM(i.potential_payout), 0) FROM bet_slip_items i WHERE i.match_id = :matchId AND i.status = 'WON')
            """, nativeQuery = true)
    List<Object[]> getSettledMatchStakesAndPayouts(@Param("matchId") String matchId);
}
