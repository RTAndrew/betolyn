package com.betolyn.features.betting.betslips.findmybetslips;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindMyBetSlipsUC implements IUseCase<String, List<BetSlipEntity>> {
    private final BetSlipRepository betSlipRepository;

    @Override
    public List<BetSlipEntity> execute(String userId) {
        return betSlipRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }
}

