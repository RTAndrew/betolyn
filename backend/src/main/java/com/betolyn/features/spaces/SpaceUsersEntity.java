package com.betolyn.features.spaces;

import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "space_users",
        uniqueConstraints = {@UniqueConstraint(name = "UniqueUserIdAndSpaceId", columnNames = {"user_id", "space_id"})}
)
public class SpaceUsersEntity extends AuditableEntity {
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;


    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private SpaceEntity space;

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(7, "spaus");
    }
}
