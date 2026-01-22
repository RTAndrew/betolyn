package com.betolyn.features.matches.creatematch;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchApiPaths;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.teams.findteambyid.FindTeamByIdUC;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MatchApiPaths.MATCHES)
@RequiredArgsConstructor
public class CreateMatchUC implements IUseCase<CreateMatchRequestDTO, MatchEntity> {
    private final FindTeamByIdUC findTeamByIdUC;
    private final MatchRepository matchRepository;

    @Override
    public MatchEntity execute(CreateMatchRequestDTO param) {
        var homeTeam = findTeamByIdUC.execute(param.getHomeTeamId());
        var awayTeam = findTeamByIdUC.execute(param.getAwayTeamId());

        MatchEntity entity = new MatchEntity();
        entity.setHomeTeam(homeTeam);
        entity.setAwayTeam(awayTeam);

        return matchRepository.save(entity);
    }
}
