package com.betolyn.features.matches.updatematchscore;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateMatchScoreUC implements IUseCase<UpdateMatchScoreParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;

    @Override
    @Transactional
    public MatchEntity execute(UpdateMatchScoreParam param) throws MatchNotFoundException {
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);

        var requestDTO = param.requestDTO();
        if (requestDTO.getHomeTeamScore() != null) {
            match.setHomeTeamScore(requestDTO.getHomeTeamScore());
        }
        if (requestDTO.getAwayTeamScore() != null) {
            match.setAwayTeamScore(requestDTO.getAwayTeamScore());
        }

        var savedMatch = matchRepository.save(match);
        matchSystemEvent.publicMatchUpdate(this, savedMatch);

        return savedMatch;
    }
}
