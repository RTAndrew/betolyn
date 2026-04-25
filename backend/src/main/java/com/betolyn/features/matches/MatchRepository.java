package com.betolyn.features.matches;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.OddStatusEnum;

public interface MatchRepository extends JpaRepository<MatchEntity, String> {
        /**
         * Use left joins so official feed matches without betting markets are still
         * returned by the public match list.
         */
        @Query("""
                        SELECT DISTINCT m
                        FROM MatchEntity m
                        LEFT JOIN FETCH m.homeTeam
                        LEFT JOIN FETCH m.awayTeam
                        LEFT JOIN FETCH m.mainCriterion mc
                        LEFT JOIN FETCH mc.odds o
                        WHERE m.type = :matchType
                        AND (mc IS NULL OR mc.status IN :criteriaStatuses)
                        AND (o IS NULL OR o.status IN :oddStatuses)
                        """)
        List<MatchEntity> findAllByMatchType(@Param("matchType") MatchTypeEnum matchType,
                        @Param("criteriaStatuses") Collection<CriterionStatusEnum> criteriaStatuses,
                        @Param("oddStatuses") Collection<OddStatusEnum> oddStatuses);

    Optional<MatchEntity> findByEspnId(String espnId);

    @Query("""
            SELECT DISTINCT m
            FROM MatchEntity m
            LEFT JOIN FETCH m.officialMatch
            WHERE m.spaceId = :spaceId AND m.type IN :matchTypes
            """)
    List<MatchEntity> findBySpaceIdAndTypeIn(
            @Param("spaceId") String spaceId, @Param("matchTypes") Collection<MatchTypeEnum> matchTypes);

    Optional<MatchEntity> findBySpaceIdAndOfficialMatchId(String spaceId, String officialMatchId);

    /** Space {@link MatchTypeEnum#DERIVED} rows linked to a feed-backed official match. */
    List<MatchEntity> findByOfficialMatch_IdAndType(String officialMatchId, MatchTypeEnum type);


    List<MatchEntity> findAllByType(MatchTypeEnum type);

    /** Space-linked events that follow the given official match (feed-backed). */
    List<MatchEntity> findAllByOfficialMatch_IdAndType(String officialMatchId, MatchTypeEnum type);

    @Query("""
            SELECT DISTINCT m
            FROM MatchEntity m
            LEFT JOIN FETCH m.homeTeam
            LEFT JOIN FETCH m.awayTeam
            LEFT JOIN FETCH m.mainCriterion mc
            LEFT JOIN FETCH mc.odds
            WHERE m.id = :id
            """)
    Optional<MatchEntity> findByIdWithReadAssociations(@Param("id") String id);

    @Query("""
            SELECT DISTINCT m
            FROM MatchEntity m
            LEFT JOIN FETCH m.homeTeam
            LEFT JOIN FETCH m.awayTeam
            LEFT JOIN FETCH m.officialMatch om
            LEFT JOIN FETCH om.homeTeam
            LEFT JOIN FETCH om.awayTeam
            WHERE m.id = :id
            """)
    Optional<MatchEntity> findByIdWithTeams(@Param("id") String id);
}
