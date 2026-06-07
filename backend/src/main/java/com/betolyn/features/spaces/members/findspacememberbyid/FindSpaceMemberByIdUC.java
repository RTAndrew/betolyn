package com.betolyn.features.spaces.members.findspacememberbyid;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.spaces.SpaceUsersEntity;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.spaces.authorization.SpaceAuthorization;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindSpaceMemberByIdUC implements IUseCase<FindSpaceMemberByIdParam, SpaceUsersEntity> {
    private final SpaceUsersRepository spaceMembersRepository;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;

    @Override
    public SpaceUsersEntity execute(FindSpaceMemberByIdParam param) {
        var spaceId = param.spaceId();
        var memberId = param.memberId();
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);

        var spaceMember = spaceMembersRepository.findById(memberId).orElseThrow(EntityNotfoundException::new);

        if (!spaceMember.getSpace().getId().equals(spaceId)) {
            throw new EntityNotfoundException();
        }

        SpaceAuthorization.canViewOrThrow(spaceMember.getSpace(), authenticatedUser.user());

        return spaceMember;
    }
}
