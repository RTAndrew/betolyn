package com.betolyn.features.matches.findmatchbyid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchNotFoundException;
import com.betolyn.features.matches.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindMatchByIdUC implements IUseCase<String, MatchEntity> {
    private final MatchRepository matchRepository;

    @Override
    public MatchEntity execute(String matchId) throws MatchNotFoundException {
        return matchRepository.findById(matchId).orElseThrow(MatchNotFoundException::new);
    }
}
