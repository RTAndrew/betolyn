package com.betolyn.features.spaces.authorization;

import java.util.Objects;

import com.betolyn.features.spaces.SpaceEntity;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRoleEnum;
import com.betolyn.shared.exceptions.BusinessRuleException;

public final class SpaceAuthorization {

    public static void canViewOrThrow(SpaceEntity space, UserEntity user) {
        // 1. check if is PLATFORM USER
        if (user.getRole().equals(UserRoleEnum.PLATFORM_USER))
            return;

        // 2. check if owner
        if (space.getOwner().getId().equals(user.getId()))
            return;

        // 3. check if user can view
        var isMember = space.getMembers()
                .stream()
                .filter((member) -> Objects.equals(member.getUser().getId(), user.getId()))
                .findFirst()
                .orElseThrow(() -> new BusinessRuleException("USER_IS_NOT_A_MEMBER", "You are not part of the space, therefore you do not have permission"));

        if (isMember == null) {
            throw new BusinessRuleException("USER_IS_NOT_A_MEMBER",
                    "You are not part of the space, therefore you do not have permission");
        }
    }

    public static void canManageOrThrow(SpaceEntity space, UserEntity user) {

        // 1. check if is PLATFORM USER
        if (user.getRole().equals(UserRoleEnum.PLATFORM_USER)) return;

        // 2. check if owner
        if (space.getOwner().getId().equals(user.getId())) return;

        // 3. check if user can view
        var isMember = space.getMembers()
                .stream()
                .filter((member) -> Objects.equals(member.getUser().getId(), user.getId()))
                .findFirst()
                .orElseThrow(() -> new BusinessRuleException("USER_IS_NOT_A_MEMBER", "You are not part of the space, therefore you do not have permission"));

        // 2. check if user can manage
        if(Boolean.FALSE.equals(isMember.getIsAdmin())) throw new BusinessRuleException("ONLY_ADMIN_CAN_ADD_MEMBERS", "Only administrators can add members");
    }


};

record IsAllowed(SpaceEntity space, UserEntity user) {
}
