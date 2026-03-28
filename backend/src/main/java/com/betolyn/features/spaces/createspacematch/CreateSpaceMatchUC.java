package com.betolyn.features.spaces.createspacematch;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Objects;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.creatematch.CreateMatchRequestDTO;
import com.betolyn.features.matches.creatematch.CreateMatchUC;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.features.spaces.SpaceEntity;
import com.betolyn.features.spaces.SpaceMatchEntity;
import com.betolyn.features.spaces.SpaceMatchRepository;
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
public class CreateSpaceMatchUC implements IUseCase<CreateSpaceMatchParam, SpaceMatchEntity> {
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

    /**
     * AUTO path: only official (platform) matches or matches already scoped to this space may be linked.
     */
    private static void assertMatchLinkableToSpace(MatchEntity match, String spaceId) {
        if (match.getIsOfficial() || Objects.equals(spaceId, match.getSpaceId())) {
            return;
        }
        throw new BadRequestException(
                "MATCH_NOT_LINKABLE",
                "This match cannot be linked to this space");
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
    private final SpaceMatchRepository spaceMatchRepository;
    private final FindMatchByIdUC findMatchByIdUC;

    private final CreateTeamUC createTeamUC;

    private final CreateMatchUC createMatchUC;

    @Override
    @Transactional
    public SpaceMatchEntity execute(CreateSpaceMatchParam input) {
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

        SpaceEntity space = findSpaceByIdUC.execute(spaceId);

        MatchEntity match;
        if (StringUtils.hasText(request.getMatchId())) {
            match = findMatchByIdUC.execute(request.getMatchId());
            assertMatchLinkableToSpace(match, spaceId);
        } else {
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
            match = createMatchUC.execute(matchReq);
        }

        // Idempotent: only skip insert when this space is already linked to this match.
        var existing = spaceMatchRepository.findBySpaceIdAndMatchId(spaceId, match.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        var spaceMatch = new SpaceMatchEntity();
        spaceMatch.setSpace(space);
        spaceMatch.setMatch(match);
        spaceMatch.setReservedLiability(BetMoney.zero());
        spaceMatch.setMaxReservedLiability(MoneyMapper.bigDecimalToBetMoney(request.getMaxReservedLiability()));

        // Concurrent requests can both pass findBySpaceIdAndMatchId above; the unique (space_id, match_id)
        // constraint ensures only one insert wins. The loser gets a duplicate-key error — not a "real"
        // failure: the row already exists. The exception does not return that row, so we re-select it
        // and return the same entity shape as the idempotent hit path (orElseThrow if still missing).
        try {
            return spaceMatchRepository.save(spaceMatch);
        } catch (DuplicateKeyException ex) {
            return spaceMatchRepository.findBySpaceIdAndMatchId(spaceId, match.getId()).orElseThrow(() -> ex);
        } catch (DataIntegrityViolationException ex) {
            if (isPostgresUniqueViolation(ex)) {
                return spaceMatchRepository.findBySpaceIdAndMatchId(spaceId, match.getId()).orElseThrow(() -> ex);
            }
            throw ex;
        }
    }
}
