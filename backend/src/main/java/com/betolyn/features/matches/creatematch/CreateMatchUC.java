package com.betolyn.features.matches.creatematch;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchMapper;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.matchSystemEvents.MatchCreatedEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.features.teams.findteambyid.FindTeamByIdUC;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateMatchUC implements IUseCase<CreateMatchRequestDTO, MatchEntity> {
    private final FindTeamByIdUC findTeamByIdUC;
    private final MatchRepository matchRepository;
    private final MatchMapper matchMapper;
    private final MatchSystemEvent matchSystemEvent;

    @Override
    @Transactional
    public MatchEntity execute(CreateMatchRequestDTO param) {
        var homeTeam = findTeamByIdUC.execute(param.getHomeTeamId());
        var awayTeam = findTeamByIdUC.execute(param.getAwayTeamId());

        MatchEntity entity = new MatchEntity();
        entity.setHomeTeam(homeTeam);
        entity.setAwayTeam(awayTeam);

        var savedMatch = matchRepository.save(entity);
        
        var eventDTO = new MatchCreatedEventDTO(savedMatch.getId(), matchMapper.toMatchDTO(savedMatch));
        matchSystemEvent.publish(this, "matchCreated", eventDTO);

        return savedMatch;
    }
}
