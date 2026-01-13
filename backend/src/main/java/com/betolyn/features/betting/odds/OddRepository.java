package com.betolyn.features.betting.odds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OddRepository extends JpaRepository<OddEntity, String> {
    @Transactional
    @Modifying
    @Query("update OddEntity o set o.value = ?1, o.status = ?2 where o.id = ?3")
    int updateValueAndStatusById(double value, OddStatusEnum status, String id);

    @Query("select o from OddEntity o where o.criterion.id = ?1 order by o.updatedAt DESC")
    List<OddEntity> findAllByCriterionId(String id);
}
