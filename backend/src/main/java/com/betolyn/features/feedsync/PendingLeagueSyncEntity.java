package com.betolyn.features.feedsync;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * When an event references teams not yet present in Betolyn, we enqueue its league so the next sync pass
 * can call espn_service ingest (teams + recent scoreboards) before re-pulling read APIs.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "feed_sync_pending_league")
public class PendingLeagueSyncEntity {

    /** Stable key: {@code sportSlug + "|" + leagueSlug}. */
    @Id
    @Column(length = 130)
    private String id;

    @Column(name = "sport_slug", nullable = false, length = 64)
    private String sportSlug;

    @Column(name = "league_slug", nullable = false, length = 64)
    private String leagueSlug;

    @Column(name = "requested_at", nullable = false)
    private Instant requestedAt = Instant.now();

    public static String compositeId(String sportSlug, String leagueSlug) {
        return sportSlug + "|" + leagueSlug;
    }
}
