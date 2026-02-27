package com.betolyn.features.betting.betslips;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BetSlipRepository extends JpaRepository<BetSlipEntity, String> {

    @Query("SELECT b FROM BetSlipEntity b WHERE b.createdBy.id = :userId ORDER BY b.createdAt DESC")
    List<BetSlipEntity> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
}
