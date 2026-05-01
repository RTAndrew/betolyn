package com.betolyn.features.matches.updatematchstatus;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.betting.criterion.suspendcriterion.SuspendBulkCriterionUC;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.features.matches.matchSystemEvents.MatchProgressChangedEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateMatchStatusUC implements IUseCase<UpdateMatchStatusParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;
    private final SuspendBulkCriterionUC suspendBulkCriterionUC;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public MatchEntity execute(UpdateMatchStatusParam param) throws MatchNotFoundException {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);
        domainPermissionService.assertCanMutateMatch(authenticatedUser, match);

        if (match.getStatus() == MatchStatusEnum.CANCELLED) {
            throw new BadRequestException(
                    "CANCELLATION_NOT_ALLOWED",
                    "Cancellation is not allowed. Use void instead.");
        }

        if (match.getType() == MatchTypeEnum.DERIVED) {
            throw new BadRequestException(
                    "CANNOT_UPDATE_DERIVED_MATCH_STATUS",
                    "Score and status for space-linked events follow the official feed; update the official match instead.");
        }

        var requestDTO = param.requestDTO();
        var previousStatus = match.getStatus();

        if (requestDTO.getStatus() == MatchStatusEnum.ENDED
                && Boolean.TRUE.equals(requestDTO.getSuspendAllCriteria())) {
            suspendBulkCriterionUC.execute(match.getId());
        }

        match.setStatus(requestDTO.getStatus());

        var savedMatch = matchRepository.save(match);

        var progressEventDTO = new MatchProgressChangedEventDTO(
                savedMatch.getId(), previousStatus, savedMatch.getStatus());
        matchSystemEvent.publish(this, new MatchSseEvent.MatchProgressChanged(progressEventDTO));

        return savedMatch;
    }
}
