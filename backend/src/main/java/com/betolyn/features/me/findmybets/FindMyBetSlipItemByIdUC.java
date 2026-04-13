package com.betolyn.features.me.findmybets;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.betting.betslips.BetSlipItemEntity;
import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindMyBetSlipItemByIdUC implements IUseCase<String, BetSlipItemEntity> {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final BetSlipItemRepository betSlipItemRepository;

    @Override
    public BetSlipItemEntity execute(String betSlipItemId) {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        return betSlipItemRepository
                .findByIdAndOwnerId(betSlipItemId, loggedUser.getId())
                .orElseThrow(EntityNotfoundException::new);
    }
}
