package com.betolyn.features.feedsync;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingLeagueSyncRepository extends JpaRepository<PendingLeagueSyncEntity, String> {

    boolean existsBySportSlugAndLeagueSlug(String sportSlug, String leagueSlug);
}
