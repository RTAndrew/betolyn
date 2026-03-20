package com.betolyn.shared.baseEntity;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import com.betolyn.features.user.UserEntity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * Optional user auditing for {@code createdBy} / {@code updatedBy}.
 *
 * <p>JPA does not let a subclass turn off or redefine mapped-superclass columns selectively. To require
 * non-null auditors on only some entities, use a separate base class (e.g. extend {@link BaseEntity} and
 * declare non-optional {@code @ManyToOne} fields there), or disable Spring Data JPA auditing for specific
 * types via a custom {@link org.springframework.data.domain.AuditorAware} / entity listeners.
 */
@MappedSuperclass
@Getter
@Setter
@RequiredArgsConstructor
public abstract class AuditableEntity extends BaseEntity{
    /** Nullable so feed sync (no logged-in user) can persist matches. */
    @ManyToOne(optional = true)
    @JoinColumn(name = "created_by", nullable = true, updatable = false)
    @CreatedBy
    private UserEntity createdBy;

    @ManyToOne(optional = true)
    @JoinColumn(name = "updated_by", nullable = true)
    @LastModifiedBy
    private UserEntity updatedBy;
}