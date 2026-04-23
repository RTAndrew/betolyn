package com.betolyn.features.betting.criterion;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CriterionRepository extends JpaRepository<CriterionEntity, String> {
    // TODO: improve the search to allow only one query with multiple parameters
    /** {@code JOIN FETCH} with a status filter limits loaded odds; {@code EXISTS} alone does not. */
    @Query("""
            SELECT DISTINCT c
            FROM CriterionEntity c
            JOIN FETCH c.odds o
            WHERE c.match.id = :matchId
            AND c.status IN :statuses
            AND o.status <> com.betolyn.features.betting.odds.OddStatusEnum.VOID
            """)
    List<CriterionEntity> findAllByMatchId(
            @Param("matchId") String id, @Param("statuses") Collection<CriterionStatusEnum> statuses);

    /** Same filters as {@link #findAllByMatchId}, one round-trip for several matches. */
    @Query("""
            SELECT DISTINCT c
            FROM CriterionEntity c
            JOIN FETCH c.odds o
            WHERE c.match.id IN :matchIds
            AND c.status IN :statuses
            AND o.status <> com.betolyn.features.betting.odds.OddStatusEnum.VOID
            """)
    List<CriterionEntity> findAllByMatchIds(
            @Param("matchIds") Collection<String> matchIds,
            @Param("statuses") Collection<CriterionStatusEnum> statuses);

    List<CriterionEntity> findByStatusIn(Collection<CriterionStatusEnum> statuses);
}
