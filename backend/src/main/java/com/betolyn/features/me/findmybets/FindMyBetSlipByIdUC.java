package com.betolyn.features.me.findmybets;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.BetSlipRepository;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindMyBetSlipByIdUC implements IUseCase<String, BetSlipEntity> {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final BetSlipRepository betSlipRepository;

    @Override
    public BetSlipEntity execute(String betSlipId) {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        return betSlipRepository
                .findByIdAndCreatedByIdWithItems(betSlipId, loggedUser.getId())
                .orElseThrow(EntityNotfoundException::new);
    }
}
