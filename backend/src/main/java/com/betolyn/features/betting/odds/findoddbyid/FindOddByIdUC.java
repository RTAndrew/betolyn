package com.betolyn.features.betting.odds.findoddbyid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindOddByIdUC implements IUseCase<String, OddEntity> {
    private final OddRepository oddRepository;

    @Override
    public OddEntity execute(String oddId) throws EntityNotfoundException {
        return oddRepository.findById(oddId).orElseThrow(EntityNotfoundException::new);
    }
}
