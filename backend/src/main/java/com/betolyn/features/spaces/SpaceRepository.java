package com.betolyn.features.spaces;

import com.betolyn.features.teams.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceRepository extends JpaRepository<SpaceEntity, String> {
}
