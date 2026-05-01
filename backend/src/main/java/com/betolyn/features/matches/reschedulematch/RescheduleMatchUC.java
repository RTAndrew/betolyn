package com.betolyn.features.matches.reschedulematch;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.features.matches.matchSystemEvents.MatchRescheduledEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RescheduleMatchUC implements IUseCase<RescheduleMatchParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public MatchEntity execute(RescheduleMatchParam param) throws MatchNotFoundException {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);
        domainPermissionService.assertCanMutateMatch(authenticatedUser, match);

        if (match.getType() == MatchTypeEnum.DERIVED) {
            throw new BadRequestException(
                    "CANNOT_RESCHEDULE_DERIVED",
                    "Derived space events follow the official match schedule; reschedule the official match instead.");
        }

        var requestDTO = param.requestDTO();

        // Validate status
        if (requestDTO.getStatus() != null
                && requestDTO.getStatus() != MatchStatusEnum.SCHEDULED
                && requestDTO.getStatus() != MatchStatusEnum.LIVE) {
            throw new BusinessRuleException("INVALID_STATUS", "Status must be either SCHEDULED or LIVE");
        }

        match.setStartTime(requestDTO.getStartTime());

        if (requestDTO.getEndTime() != null) {
            match.setEndTime(requestDTO.getEndTime());
        }

        if (requestDTO.getStatus() != null) {
            match.setStatus(requestDTO.getStatus());
        }

        var savedMatch = matchRepository.save(match);

        var eventDTO = new MatchRescheduledEventDTO(savedMatch.getId(), savedMatch.getStartTime(), savedMatch.getEndTime());
        matchSystemEvent.publish(this, new MatchSseEvent.Rescheduled(eventDTO));

        return savedMatch;
    }
}
