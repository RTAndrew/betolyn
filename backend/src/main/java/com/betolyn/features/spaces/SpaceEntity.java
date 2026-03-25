package com.betolyn.features.spaces;

import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "spaces")
public class SpaceEntity extends AuditableEntity {
    @Column(nullable = false)
    private String name;
    private String description;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(7, "spa");
    }
}
