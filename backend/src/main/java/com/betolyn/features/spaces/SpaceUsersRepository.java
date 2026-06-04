package com.betolyn.features.spaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.betolyn.features.user.UserEntity;

import jakarta.annotation.Nullable;

public interface SpaceUsersRepository extends JpaRepository<SpaceUsersEntity, String> {
    boolean existsBySpaceIdAndUserIdAndIsAdminTrue(String spaceId, String userId);

    @Query("""
            select s from SpaceUsersEntity s
            where s.space.id = :id
                and (
                    upper(s.user.username) like upper(concat('%', :username, '%'))
                    or upper(s.user.email) like upper(concat('%', :username, '%'))
                )
            order by s.isAdmin desc""")
    List<SpaceUsersEntity> findAllBySpaceIdAndUserNames(@Param("id") String id, @Param("username") String username);

    @Query("select s from SpaceUsersEntity s where s.space.id = :id order by s.isAdmin desc")
    List<SpaceUsersEntity> findAllBySpaceId(@Param("id") String id);

    @Query("""
            SELECT u
            FROM UserEntity u
            WHERE NOT EXISTS (
                SELECT 1
                FROM SpaceUsersEntity s
                WHERE s.space.id = :spaceId
                  AND s.user.id = u.id
            )
            AND (
                upper(u.username) LIKE upper(concat('%', :query, '%'))
                OR upper(u.email) LIKE upper(concat('%', :email, '%'))
            )
            """)
    List<UserEntity> findUsersNotMemberOfSpaceByQuery(
            @Param("spaceId") String spaceId,
            @Param("query") String query,
            @Nullable @Param("email") String email);

}
