package com.betolyn.features.betting.betslips;

import com.betolyn.features.matches.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BetSlipRepository extends JpaRepository<BetSlipEntity, String> {
}
