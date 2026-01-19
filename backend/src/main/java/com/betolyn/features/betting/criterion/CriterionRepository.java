package com.betolyn.features.betting.criterion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface CriterionRepository extends JpaRepository<CriterionEntity, String> {
    // TODO: improve the search to allow only one query with multiple parameters
    @Query("select c from CriterionEntity c where c.match.id = ?1 and c.status in ?2")
    List<CriterionEntity> findAllByMatchId(String id, Collection<CriterionStatusEnum> statuses);

    List<CriterionEntity> findByStatusIn(Collection<CriterionStatusEnum> statuses);
}
