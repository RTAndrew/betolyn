package com.betolyn.features.betting.odds.findallodds;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindAllOddsUC implements IUseCaseNoParams<List<OddEntity>> {
    private final OddRepository oddRepository;

    @Override
    public List<OddEntity> execute() {
        return oddRepository.findAll();
    }
}
