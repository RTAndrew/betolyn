package com.betolyn.features.spaces.addspacemember;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.betolyn.features.spaces.authorization.SpaceAuthorization;
import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.spaces.SpaceUsersEntity;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.spaces.findspacebyid.FindSpaceByIdUC;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.findallusers.FindAllUsersUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddSpaceMemberUC implements IUseCase<AddSpaceMembersParam, Void> {
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final SpaceUsersRepository spaceUsersRepository;
    private final FindAllUsersUC findAllUsersUC;

    @Override
    public Void execute(AddSpaceMembersParam param) {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);
        var space = findSpaceByIdUC.execute(param.spaceId());
        var spaceMembers = space.getMembers();

        List<String> alreadyMembers = new ArrayList<>();
        for (var member : spaceMembers) {
            var memberId = member.getUser().getId();
            if (param.users().contains(memberId)) {
                alreadyMembers.add(memberId);
            }
        }
        if (!alreadyMembers.isEmpty()) {
            throw new BusinessRuleException("USERS_ALREADY_MEMBERS", "Some users are already member of the channel",
                    Collections.singletonList(alreadyMembers));
        }

        SpaceAuthorization.canManageOrThrow(space, authenticatedUser.user());

        // TODO: add invitedBy or addedBy
        var foundUsers = findAllUsersUC.execute(Optional.of(param.users()));
        List<UserEntity> usersNotFound = new ArrayList<>();
        List<SpaceUsersEntity> usersToAdd = new ArrayList<>();
        for (var user : foundUsers) {
            if (!param.users().contains(user.getId())) {
                usersNotFound.add(user);
                continue;
            }
            var entity = new SpaceUsersEntity();
            entity.setUser(user);
            entity.setSpace(space);
            entity.setIsAdmin(false);
            usersToAdd.add(entity);
        }

        if (!usersNotFound.isEmpty()) {
            throw new BusinessRuleException("USERS_NOT_FOUND", "Some users were not found", Collections.singletonList(usersNotFound));
        }

        spaceUsersRepository.saveAll(usersToAdd);
        return null;
    }
}
