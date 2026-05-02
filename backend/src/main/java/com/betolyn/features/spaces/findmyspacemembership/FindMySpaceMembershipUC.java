package com.betolyn.features.spaces.findmyspacemembership;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.shared.exceptions.AccessForbiddenException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindMySpaceMembershipUC {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final SpaceUsersRepository spaceUsersRepository;

    // THOUGHT: We could use a cache here to avoid querying the database for every request

    public SpaceMembershipDTO execute(String spaceId) {
        if (!StringUtils.hasText(spaceId)) {
            throw new AccessForbiddenException();
        }
        var authenticated = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);
        var normalizedSpaceId = spaceId.trim();
        var userId = authenticated.user().getId();
        boolean isAdmin = spaceUsersRepository.existsBySpaceIdAndUserIdAndIsAdminTrue(normalizedSpaceId, userId);
        return new SpaceMembershipDTO(isAdmin);
    }
}
