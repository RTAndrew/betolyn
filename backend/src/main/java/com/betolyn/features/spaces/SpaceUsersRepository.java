package com.betolyn.features.spaces;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceUsersRepository extends JpaRepository<SpaceUsersEntity, String> {
    boolean existsBySpaceIdAndUserIdAndIsAdminTrue(String spaceId, String userId);
}
