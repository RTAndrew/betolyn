package com.betolyn.features.betting.betslips;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BetSlipRepository extends JpaRepository<BetSlipEntity, String> {

    @Query("SELECT b FROM BetSlipEntity b WHERE b.createdBy.id = :userId ORDER BY b.createdAt DESC")
    List<BetSlipEntity> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);

    @Query("""
            SELECT DISTINCT b FROM BetSlipEntity b
            JOIN FETCH b.items i
            JOIN FETCH i.odd o
            JOIN FETCH o.criterion c
            JOIN FETCH c.match
            LEFT JOIN FETCH i.oddHistory
            WHERE b.id = :id AND b.createdBy.id = :userId
            """)
    Optional<BetSlipEntity> findByIdAndCreatedByIdWithItems(@Param("id") String id, @Param("userId") String userId);
}
