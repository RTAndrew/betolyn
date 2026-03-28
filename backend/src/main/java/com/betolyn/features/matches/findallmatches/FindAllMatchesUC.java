package com.betolyn.features.matches.findallmatches;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindAllMatchesUC implements IUseCaseNoParams<List<MatchEntity>> {
    private final MatchRepository matchRepository;

    @Override
    public List<MatchEntity> execute() {
        return matchRepository.findAllByType(MatchTypeEnum.OFFICIAL);
    }
}
