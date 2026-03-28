package com.betolyn.features.spaces.createspacematch;

import java.math.BigDecimal;
import java.sql.SQLException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.matches.creatematch.CreateMatchRequestDTO;
import com.betolyn.features.matches.creatematch.CreateMatchUC;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.spaces.findspacebyid.FindSpaceByIdUC;
import com.betolyn.features.teams.createteam.CreateTeamRequestDTO;
import com.betolyn.features.teams.createteam.CreateTeamUC;
import com.betolyn.shared.MoneyMapper;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;
import com.betolyn.shared.money.BetMoney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateSpaceMatchUC implements IUseCase<CreateSpaceMatchParam, MatchEntity> {
    private static void validateCustomEventFields(CreateSpaceMatchRequestDTO request) {
        if (!StringUtils.hasText(request.getHomeTeamName())
                || !StringUtils.hasText(request.getAwayTeamName())
                || !StringUtils.hasText(request.getStartTime())
                || !StringUtils.hasText(request.getEndTime())) {
            throw new BadRequestException(
                    "MISSING_CUSTOM_EVENT_FIELDS",
                    "homeTeamName, awayTeamName, startTime, and endTime are required when matchId is not set");
        }
    }

    private static CreateTeamRequestDTO homeTeamRequest(String name) {
        return new CreateTeamRequestDTO(name.trim());
    }

    private static boolean isPostgresUniqueViolation(DataIntegrityViolationException ex) {
        for (Throwable cur = ex; cur != null; cur = cur.getCause()) {
            if (cur instanceof SQLException sql && "23505".equals(sql.getSQLState())) {
                return true;
            }
        }
        return false;
    }

    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final SpaceUsersRepository spaceUsersRepository;
    private final MatchRepository matchRepository;
    private final FindMatchByIdUC findMatchByIdUC;

    private final CreateTeamUC createTeamUC;

    private final CreateMatchUC createMatchUC;

    @Override
    @Transactional
    public MatchEntity execute(CreateSpaceMatchParam input) {
        var spaceId = input.spaceId();
        var request = input.request();

        if (request.getMaxReservedLiability() == null
                || request.getMaxReservedLiability().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("INVALID_LIABILITY", "maxReservedLiability must be greater than zero");
        }

        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);
        var userId = authenticatedUser.user().getId();
        if (!spaceUsersRepository.existsBySpaceIdAndUserId(spaceId, userId)) {
            throw new AccessForbiddenException();
        }


        findSpaceByIdUC.execute(spaceId);

        if (StringUtils.hasText(request.getMatchId())) {
            MatchEntity match = findMatchByIdUC.execute(request.getMatchId());

            // Only official feed matches can be added as a derived space event
            if (match.getType() != MatchTypeEnum.OFFICIAL) {
                throw new BadRequestException(
                        "INVALID_MATCH_TYPE_FOR_LINK",
                        "Only official feed matches can be added as a derived space event");
            }

            var existing = matchRepository.findBySpaceIdAndOfficialMatchId(spaceId, match.getId());
            if (existing.isPresent()) {
                return existing.get();
            }

            var derivedMatch = new MatchEntity();
            derivedMatch.setType(MatchTypeEnum.DERIVED);
            derivedMatch.setSpaceId(spaceId);
            derivedMatch.setOfficialMatch(match);
            derivedMatch.setReservedLiability(BetMoney.zero());
            derivedMatch.setMaxReservedLiability(MoneyMapper.bigDecimalToBetMoney(request.getMaxReservedLiability()));

            try {
                return matchRepository.save(derivedMatch);
            } catch (DuplicateKeyException ex) {
                // Idempotent: only skip insert when this space is already linked to this match.
                return matchRepository
                        .findBySpaceIdAndOfficialMatchId(spaceId, match.getId())
                        .orElseThrow(() -> ex);
            } catch (DataIntegrityViolationException ex) {
                // Idempotent: only skip insert when this space is already linked to this match.
                if (isPostgresUniqueViolation(ex)) {
                    return matchRepository
                            .findBySpaceIdAndOfficialMatchId(spaceId, match.getId())
                            .orElseThrow(() -> ex);
                }
                throw ex;
            }
        }

        validateCustomEventFields(request);

        var homeTeam = createTeamUC.execute(homeTeamRequest(request.getHomeTeamName()));
        var awayTeam = createTeamUC.execute(homeTeamRequest(request.getAwayTeamName()));
        var matchReq = new CreateMatchRequestDTO();
        matchReq.setHomeTeamId(homeTeam.getId());
        matchReq.setAwayTeamId(awayTeam.getId());
        matchReq.setStartTime(request.getStartTime());
        matchReq.setEndTime(request.getEndTime());
        matchReq.setSpaceId(spaceId);
        matchReq.setMaxReservedLiability(request.getMaxReservedLiability());
        return createMatchUC.execute(matchReq);
    }
}
