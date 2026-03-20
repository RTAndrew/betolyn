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
 * Event row queued because home/away {@link com.betolyn.features.teams.TeamEntity} rows were not in Betolyn yet.
 * Replayed after team sync (see {@link FeedSyncBatchService#drainPendingEvents}).
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "feed_sync_pending_events")
public class FeedSyncPendingEventEntity {

    @Id
    @Column(name = "espn_event_id", length = 64)
    private String espnEventId;

    /** Full JSON object from {@code /api/sync/v1/events} for one row. */
    @Column(nullable = false, columnDefinition = "text")
    private String payloadJson;

    private Instant queuedAt;
}
