package com.betolyn.features.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    UserEntity findByEmail(String email);
    UserEntity findByUsername(String username);

    @Query("""
                    SELECT u
                    FROM UserEntity u
                    WHERE u.id = :id
                     OR upper(u.username) LIKE upper(concat('%', :username, '%'))
                     OR upper(u.email) LIKE upper(concat('%', :email, '%'))
            """)
    List<UserEntity> findAllByQueryStrings(@Param("id") String id,  @Param("username") String username, @Param("email") String email);
}
