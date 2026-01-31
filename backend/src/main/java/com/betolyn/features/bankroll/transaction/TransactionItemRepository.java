package com.betolyn.features.bankroll.transaction;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionItemRepository extends JpaRepository<TransactionItemEntity, String> {
}
