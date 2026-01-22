package com.betolyn.features.matches.updatematchstatus;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchNotFoundException;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateMatchStatusUC implements IUseCase<UpdateMatchStatusParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;

    @Override
    @Transactional
    public MatchEntity execute(UpdateMatchStatusParam param) throws MatchNotFoundException {
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);

        var requestDTO = param.requestDTO();
        match.setStatus(requestDTO.getStatus());

        var savedMatch = matchRepository.save(match);
        matchSystemEvent.publicMatchUpdate(this, savedMatch);

        return savedMatch;
    }
}
