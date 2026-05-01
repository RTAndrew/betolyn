package com.betolyn.features.user;

import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.util.Collection;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_userentity_username_email", columnList = "username, email")
})
public class UserEntity extends BaseEntity implements UserDetails {

    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false, unique = true)
    private String email;
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false)
    private UserRoleEnum role = UserRoleEnum.USER;

    public UserEntity(String password, String email, String username) {
        super();
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = UserRoleEnum.USER;
    }

    public UserEntity(String id, String password, String email, String username) {
        super();
        super.setId(id);
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = UserRoleEnum.USER;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var effectiveRole = role == null ? UserRoleEnum.USER : role;
        return List.of(new SimpleGrantedAuthority("ROLE_" + effectiveRole.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "u");
    }
}
