package com.betolyn.features.spaces;

import java.util.ArrayList;
import java.util.List;

import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
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

    @NonNull
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserEntity owner;

    @OneToMany(mappedBy = "space")
    private List<SpaceUsersEntity> members = new ArrayList<>();

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(7, "spa");
    }
}
