package com.betolyn.features.betting.odds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OddRepository extends JpaRepository<OddEntity, String> {
    @Query("select o from OddEntity o where o.criterion.id = ?1 order by o.updatedAt DESC")
    List<OddEntity> findAllByCriterionId(String id);
}
