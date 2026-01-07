package com.betolyn.features.betting.odds;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OddHistoryRepository extends JpaRepository<OddHistoryEntity, String> {
}
