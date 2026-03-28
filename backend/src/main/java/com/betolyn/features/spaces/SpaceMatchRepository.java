package com.betolyn.features.spaces;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceMatchRepository extends JpaRepository<SpaceMatchEntity, String> {

    Optional<SpaceMatchEntity> findBySpaceIdAndMatchId(String spaceId, String matchId);
}
