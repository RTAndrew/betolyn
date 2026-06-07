package com.betolyn.features.spaces.addmemberasadmin;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.spaces.SpaceUsersEntity;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.spaces.authorization.SpaceAuthorization;
import com.betolyn.features.spaces.findspacebyid.FindSpaceByIdUC;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddOrRemoveMemberAsAdminUC implements IUseCase<AddOrRemoveMemberAsAdminParam, SpaceUsersEntity> {
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final SpaceUsersRepository spaceUsersRepository;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;

    @Override
    public SpaceUsersEntity execute(AddOrRemoveMemberAsAdminParam param) {
        var authenticatedUser = getAuthenticatedUserUC.execute().get().user();
        var space = findSpaceByIdUC.execute(param.spaceId());

        SpaceAuthorization.canManageOrThrow(space, authenticatedUser);

        // canManageOrThrow already queries for all the users (LAZY). So, instead of
        // querying
        // spaceUsersRepository exists, we reuse the space.members
        // TODO: when this grows, there should be a separate query for the member
        SpaceUsersEntity memberToSave = null;
        for (var member : space.getMembers()) {
            if (!member.getId().equals(param.memberId())) {
                continue;
            }

            if (member.getUser().getId().equals(space.getOwner().getId())) {
                throw new BusinessRuleException("CANNOT_REMOVE_SPACE_OWNER_FROM_ADMIN",
                        "Cannot remove the space owner as administrator");
            }

            if (member.getIsAdmin().equals(param.addAsAdmin())) {
                return member;
            }

            // Do not modify the space.members collection so it does not flush (UPDATE ALL)
            memberToSave = member;
            memberToSave.setIsAdmin(param.addAsAdmin());
            break;
        }

        if (memberToSave == null) {
            throw new BusinessRuleException("MEMBER_NOT_FOUND", "Member not found");
        }

        spaceUsersRepository.save(memberToSave);
        return memberToSave;
    }
}
