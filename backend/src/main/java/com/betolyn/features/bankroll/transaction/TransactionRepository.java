package com.betolyn.features.bankroll.transaction;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<TransactionEntity, String> {

    @Query("""
            SELECT DISTINCT t FROM TransactionEntity t
            JOIN FETCH t.items
            WHERE t.id IN (
                SELECT i.transaction.id FROM TransactionItemEntity i
                WHERE i.fromAccountId = :accountId OR i.toAccountId = :accountId
            )
            ORDER BY t.createdAt DESC
            """)
    List<TransactionEntity> findAllByAccountId(@Param("accountId") String accountId);

    @Query("SELECT t FROM TransactionEntity t JOIN FETCH t.items WHERE t.id = :id")
    Optional<TransactionEntity> findByIdWithItems(@Param("id") String id);
}
