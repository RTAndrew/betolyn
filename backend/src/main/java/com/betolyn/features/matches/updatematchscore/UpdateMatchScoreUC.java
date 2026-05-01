package com.betolyn.features.matches.updatematchscore;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.features.matches.matchSystemEvents.MatchScoreChangedEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateMatchScoreUC implements IUseCase<UpdateMatchScoreParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public MatchEntity execute(UpdateMatchScoreParam param) throws MatchNotFoundException {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);
        domainPermissionService.assertCanMutateMatch(authenticatedUser, match);

        if (match.getType() == MatchTypeEnum.DERIVED) {
            throw new BadRequestException(
                    "CANNOT_UPDATE_DERIVED_MATCH_SCORE",
                    "Scores for space-linked events follow the official feed; update the official match instead.");
        }

        var requestDTO = param.requestDTO();
        if (requestDTO.getHomeTeamScore() != null) {
            match.setHomeTeamScore(requestDTO.getHomeTeamScore());
        }
        if (requestDTO.getAwayTeamScore() != null) {
            match.setAwayTeamScore(requestDTO.getAwayTeamScore());
        }

        var savedMatch = matchRepository.save(match);

        var eventDTO = new MatchScoreChangedEventDTO(
                savedMatch.getId(), savedMatch.getHomeTeamScore(), savedMatch.getAwayTeamScore());
        matchSystemEvent.publish(this, new MatchSseEvent.ScoreChanged(eventDTO));

        return savedMatch;
    }
}
