package com.betolyn.shared.baseEntity;

import com.betolyn.utils.UUID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id
    private String id;

    @CreatedDate
    @CreationTimestamp(source = SourceType.DB)
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp(source = SourceType.DB)
    private LocalDateTime updatedAt;

    /**
     * The identifier to which the ID will be prefixed (e.g: cus_a2sIO)
     */
    protected abstract EntityUUID getUUIDPrefix();

    protected String generateId() {
        var uuid = getUUIDPrefix();
        if (uuid.prefix() == null) {
            return new UUID(uuid.size()).generate();
        }
        return new UUID(uuid.size(), uuid.prefix()).generate();
    }

    @PrePersist
    protected void onCreate() {
        var now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        this.id = generateId();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}