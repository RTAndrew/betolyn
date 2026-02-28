package com.betolyn.features.betting.betslips;

import com.betolyn.features.betting.betslips.enums.BetSlipItemStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BetSlipItemRepository extends JpaRepository<BetSlipItemEntity, String> {

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
}
