package com.betolyn.features.betting.betslips.findbetslipbyid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindBetSlipByIdUC implements IUseCase<String, BetSlipEntity> {
    private final BetSlipRepository betSlipRepository;

    @Override
    public BetSlipEntity execute(String betSlipId) throws EntityNotfoundException {
        return betSlipRepository.findById(betSlipId).orElseThrow(EntityNotfoundException::new);
    }
}
