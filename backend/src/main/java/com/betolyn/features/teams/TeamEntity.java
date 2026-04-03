package com.betolyn.features.teams;

import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "teams")
public class TeamEntity extends BaseEntity {
    @Column(nullable = false)
    private String name;

    /** ESPN team id for feed sync / dedupe (nullable for legacy rows). */
    @Column(nullable = true, unique = true)
    private String espnId;
    /** Single team mark URL (resolved during feed sync from `logo` or `logos`). */
    private String badgeUrl;

    private String color;
    private String shortName;
    private String alternateColor;
    private String nameAbbreviation;

    /**
     * True for teams synced from the feed; false for teams created via the API (e.g. custom space events).
     */
    @JsonProperty("isOfficial")
    @Column(name = "is_official", nullable = false)
    private boolean isOfficial = false;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "team");
    }

    // Keeping relationships unidirectional (Match -> Team only),
    // to prevent accidental "Infinite Recursion"
    // when converting entities to JSON.
    // private List<MatchEntity> matches;
}
