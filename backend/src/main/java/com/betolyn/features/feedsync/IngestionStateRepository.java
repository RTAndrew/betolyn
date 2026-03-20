package com.betolyn.features.feedsync;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IngestionStateRepository extends JpaRepository<IngestionStateEntity, String> {
}
