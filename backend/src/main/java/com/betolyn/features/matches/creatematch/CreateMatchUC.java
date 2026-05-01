package com.betolyn.features.matches.creatematch;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.matches.MatchDtoAssembler;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.matches.matchSystemEvents.MatchCreatedEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.features.teams.findteambyid.FindTeamByIdUC;
import com.betolyn.shared.MoneyMapper;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BadRequestException;
import com.betolyn.shared.money.BetMoney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateMatchUC implements IUseCase<CreateMatchRequestDTO, MatchEntity> {
    private final FindTeamByIdUC findTeamByIdUC;
    private final MatchRepository matchRepository;
    private final MatchDtoAssembler matchDtoAssembler;
    private final MatchSystemEvent matchSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public MatchEntity execute(CreateMatchRequestDTO param) {
        var homeTeam = findTeamByIdUC.execute(param.getHomeTeamId());
        var awayTeam = findTeamByIdUC.execute(param.getAwayTeamId());

        MatchEntity entity = new MatchEntity();
        entity.setHomeTeam(homeTeam);
        entity.setAwayTeam(awayTeam);
        entity.setStartTime(param.getStartTime());
        entity.setEndTime(param.getEndTime());
        entity.setType(MatchTypeEnum.OFFICIAL);
        entity.setHomeTeamScore(param.getHomeTeamScore());
        entity.setAwayTeamScore(param.getAwayTeamScore());
        entity.setReservedLiability(BetMoney.zero());
        entity.setMaxReservedLiability(null);

        // unofficial match created by space user
        if (StringUtils.hasText(param.getSpaceId())) {
            var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);
            var spaceId = param.getSpaceId().trim();
            domainPermissionService.assertIsSpaceAdmin(authenticatedUser.user(), spaceId);
            if (param.getMaxReservedLiability() == null
                    || param.getMaxReservedLiability().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException(
                        "INVALID_LIABILITY", "maxReservedLiability is required when spaceId is set");
            }
            entity.setSpaceId(spaceId);
            entity.setType(MatchTypeEnum.CUSTOM);
            entity.setReservedLiability(BetMoney.zero());
            entity.setMaxReservedLiability(MoneyMapper.bigDecimalToBetMoney(param.getMaxReservedLiability()));
        }

        var savedMatch = matchRepository.save(entity);

        var eventDTO = new MatchCreatedEventDTO(savedMatch.getId(), matchDtoAssembler.forMatchDetail(savedMatch));
        matchSystemEvent.publish(this, new MatchSseEvent.MatchCreated(eventDTO));

        return savedMatch;
    }
}
