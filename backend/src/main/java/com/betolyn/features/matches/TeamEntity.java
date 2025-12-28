package com.betolyn.features.matches;

import com.betolyn.shared.BaseEntity;
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
    private String badgeUrl;

    //   Keeping relationships unidirectional (Match -> Team only),
    //   to prevent accidental "Infinite Recursion"
    //   when converting entities to JSON.
    //   private List<MatchEntity> matches;
}
