package com.betolyn.features.matches.findallmatches;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindAllMatchesUC implements IUseCaseNoParams<List<MatchEntity>> {
    private final MatchRepository matchRepository;

    @Override
    public List<MatchEntity> execute() {
        return matchRepository.findAll();
    }
}
