package com.betolyn.features.betting.odds;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OddRepository extends JpaRepository<OddEntity, String> {
    @Query("select o from OddEntity o where o.criterion.id = ?1 order by o.updatedAt DESC")
    List<OddEntity> findAllByCriterionId(String id);

    @Query("select o from OddEntity o where o.criterion.match.id = ?1")
    List<OddEntity> findAllByMatchId(String matchId);

    @Query("""
            SELECT DISTINCT o FROM OddEntity o
            JOIN FETCH o.criterion c
            JOIN FETCH c.match m
            WHERE m.id IN :matchIds
            """)
    List<OddEntity> findAllByMatchIdIn(@Param("matchIds") Collection<String> matchIds);

    @Query("""
            SELECT DISTINCT o FROM OddEntity o
            JOIN FETCH o.criterion c
            WHERE c.id IN :criterionIds
            AND o.status IN :statuses
            ORDER BY o.name
            """)
    List<OddEntity> findAllByCriterionIdInAndStatusIn(
            @Param("criterionIds") Collection<String> criterionIds,
            @Param("statuses") Collection<OddStatusEnum> statuses);
}
