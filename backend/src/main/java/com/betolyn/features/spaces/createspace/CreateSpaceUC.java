package com.betolyn.features.spaces.createspace;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.createaccountforspace.CreateAccountForSpaceUC;
import com.betolyn.features.spaces.SpaceEntity;
import com.betolyn.features.spaces.SpaceRepository;
import com.betolyn.features.spaces.SpaceUsersEntity;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.user.findallusers.FindAllUsersUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateSpaceUC implements IUseCase<CreateSpaceRequestDTO, SpaceEntity> {
    private final SpaceRepository spaceRepository;
    private final SpaceUsersRepository spaceUsersRepository;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindAllUsersUC findAllUsersUC;
    private final CreateAccountForSpaceUC createAccountForSpaceUC;

    @Override
    @Transactional
    public SpaceEntity execute(CreateSpaceRequestDTO param) {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);

        var space = new SpaceEntity();
        space.generateId();
        space.setName(param.name());
        space.setDescription(param.description());

        var memberIds = new ArrayList<>(Objects.requireNonNullElse(param.userIds(), List.of()));
        memberIds.add(authenticatedUser.user().getId());
        List<String> uniqueMemberIds = memberIds.stream().distinct().toList();

        space = spaceRepository.save(space);
        createAccountForSpaceUC.execute(space);

        List<SpaceUsersEntity> spaceMembers = new ArrayList<>();
        if (!uniqueMemberIds.isEmpty()) {
            var members = findAllUsersUC.execute(Optional.of(uniqueMemberIds));
            for (var user : members) {
                var membership = new SpaceUsersEntity();
                membership.setUser(user);
                membership.setSpace(space);
                membership.setIsAdmin(user.getId().equals(authenticatedUser.user().getId()));
                spaceMembers.add(membership);
            }
        }

        spaceUsersRepository.saveAll(spaceMembers);

        return space;
    }
}
