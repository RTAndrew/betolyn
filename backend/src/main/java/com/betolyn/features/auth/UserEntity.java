package com.betolyn.features.auth;

import com.betolyn.shared.BaseEntity;
import com.betolyn.utils.GenerateId;
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
@Table(name = "users")
public class UserEntity extends BaseEntity {

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
}
