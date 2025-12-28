package com.betolyn.features.betting;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OddRepository extends JpaRepository<OddEntity, String> {
}
