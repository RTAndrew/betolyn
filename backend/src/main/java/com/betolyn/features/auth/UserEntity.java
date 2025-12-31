package com.betolyn.features.auth;

import com.betolyn.shared.BaseEntity;
import com.betolyn.utils.GenerateId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity extends BaseEntity implements UserDetails {

    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String email;


    public UserEntity(String password, String email, String username) {
        super();
        super.setId(generateId());
        this.email = email;
        this.username = username;
        this.password = password;

    }

    public UserEntity(String id, String password, String email, String username) {
        super();
        super.setId(id);
        this.email = email;
        this.username = username;
        this.password = password;
    }

    private String generateId() {
        return new GenerateId(12, "u").generate();
    }

    public void generateUUID() {
        setId(generateId());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ADMIN"));
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
}
