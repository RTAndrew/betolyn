package com.betolyn.features.matches;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;

public interface MatchRepository extends JpaRepository<MatchEntity, String> {
        /**
         * Official match list: {@link MatchEntity#GRAPH_OFFICIAL_LIST} eager-fetches teams,
         * highlight criterion, and auditors in one round-trip. Odds are batch-loaded separately
         * in {@link com.betolyn.features.matches.findallmatches.FindAllMatchesUC}.
         */
        @EntityGraph(value = MatchEntity.GRAPH_OFFICIAL_LIST, type = EntityGraphType.FETCH)
        @Query("""
                        SELECT m
                        FROM MatchEntity m
                        LEFT JOIN m.mainCriterion mc
                        WHERE m.type = :matchType
                        AND (mc IS NULL OR mc.status IN :criteriaStatuses)
                        """)
        List<MatchEntity> findAllByMatchType(@Param("matchType") MatchTypeEnum matchType,
                        @Param("criteriaStatuses") Collection<CriterionStatusEnum> criteriaStatuses);

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
