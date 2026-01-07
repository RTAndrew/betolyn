package com.betolyn.shared.baseEntity;

import com.betolyn.features.user.UserEntity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

@MappedSuperclass
@Getter
@Setter
@RequiredArgsConstructor
public abstract class AuditableEntity extends BaseEntity{
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false, updatable = false)
    @CreatedBy
    private UserEntity createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = false)
    @LastModifiedBy
    private UserEntity updatedBy;
}