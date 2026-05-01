package com.betolyn.features.auth.permissions;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRoleEnum;
import com.betolyn.shared.exceptions.AccessForbiddenException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DomainPermissionService {
    private final SpaceUsersRepository spaceUsersRepository;

    public void assertCanMutateMatch(UserEntity user, MatchEntity match) {
        if (isPlatformUser(user)) {
            return;
        }

        var matchType = match.getType();
        var spaceId = match.getSpaceId();
        if (matchType == MatchTypeEnum.OFFICIAL || !StringUtils.hasText(spaceId)) {
            throw new AccessForbiddenException();
        }

        var normalizedSpaceId = spaceId.trim();
        if (!spaceUsersRepository.existsBySpaceIdAndUserIdAndIsAdminTrue(normalizedSpaceId, user.getId())) {
            throw new AccessForbiddenException();
        }
    }

    public void assertCanMutateCriterion(UserEntity user, CriterionEntity criterion) {
        assertCanMutateMatch(user, criterion.getMatch());
    }

    public void assertCanMutateOdd(UserEntity user, OddEntity odd) {
        assertCanMutateMatch(user, odd.getCriterion().getMatch());
    }

    public void assertIsSpaceAdmin(UserEntity user, String spaceId) {
        if (isPlatformUser(user)) {
            return;
        }

        if (!StringUtils.hasText(spaceId)) {
            throw new AccessForbiddenException();
        }

        var normalizedSpaceId = spaceId.trim();
        if (!spaceUsersRepository.existsBySpaceIdAndUserIdAndIsAdminTrue(normalizedSpaceId, user.getId())) {
            throw new AccessForbiddenException();
        }
    }

    public void assertIsPlatformUser(UserEntity user) {
        if (!isPlatformUser(user)) {
            throw new AccessForbiddenException();
        }
    }

    private boolean isPlatformUser(UserEntity user) {
        return user.getRole() == UserRoleEnum.PLATFORM_USER;
    }
}
