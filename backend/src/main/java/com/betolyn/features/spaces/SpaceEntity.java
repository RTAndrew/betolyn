package com.betolyn.features.spaces;

import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.exceptions.BusinessRuleException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "spaces")
public class SpaceEntity extends AuditableEntity {
    @Column(nullable = false)
    private String name;
    private String description;

    @OneToMany(mappedBy = "space")
    private List<SpaceUsersEntity> members = new ArrayList<>();

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(7, "spa");
    }

    public Boolean canAddMembers(UserEntity user) {
        var isMember = getMembers()
                .stream()
                .filter((member) -> Objects.equals(member.getUser().getId(), user.getId()))
                .findFirst()
                .orElseThrow(() -> new BusinessRuleException("USER_IS_NOT_A_MEMBER", "You are not part of the space, therefore you do not have permission"));

        return isMember.getIsAdmin();
    }
}
