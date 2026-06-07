package com.betolyn.features.spaces.findspacecandidatemembers;

import java.util.List;

import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.spaces.authorization.SpaceAuthorization;
import com.betolyn.features.spaces.findspacebyid.FindSpaceByIdUC;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.user.UserEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindSpaceCandidateMembersUC implements IUseCase<FindSpaceCandidateMembersParams, List<UserEntity>> {
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final SpaceUsersRepository spaceUsersRepository;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;

    @Override
    public List<UserEntity> execute(FindSpaceCandidateMembersParams param) {
        var space = findSpaceByIdUC.execute(param.spaceId());
        var authenticatedUser = getAuthenticatedUserUC.execute().get().user();
        SpaceAuthorization.canManageOrThrow(space, authenticatedUser);

        if (param.query() == null || param.query().isBlank()) {
            return List.of();
        }

        String email = null;
        if (EmailValidator.getInstance().isValid(param.query())) {
            email = param.query();
        }

        return spaceUsersRepository.findUsersNotMemberOfSpaceByQuery(param.spaceId(), param.query(), email);
    }
}
