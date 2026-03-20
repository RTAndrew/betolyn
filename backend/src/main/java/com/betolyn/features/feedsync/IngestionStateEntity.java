package com.betolyn.features.feedsync;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ingestion_state")
public class IngestionStateEntity {

    public static final String SOURCE_EVENTS = "events";
    public static final String SOURCE_TEAMS = "teams";

    @Id
    private String source;
    private Instant watermarkUpdatedAt;
    private Long watermarkRowId;
    private Instant lastRunStartedAt;
    private Instant lastRunCompletedAt;

    @Column(length = 4000)
    private String lastError;

    private Instant rowUpdatedAt;
}
