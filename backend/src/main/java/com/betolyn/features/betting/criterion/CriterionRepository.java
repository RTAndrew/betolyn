package com.betolyn.features.betting.criterion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CriterionRepository extends JpaRepository<CriterionEntity, String> {
    @Query("select c from CriterionEntity c where c.match.id = ?1 order by c.name")
    List<CriterionEntity> findAllByMatchId(String id);
}
