package com.betolyn.features.teams;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<TeamEntity, String> {

    Optional<TeamEntity> findByEspnId(String espnId);
}
