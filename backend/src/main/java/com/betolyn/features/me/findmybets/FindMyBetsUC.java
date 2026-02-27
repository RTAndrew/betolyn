package com.betolyn.features.me.findmybets;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.betting.betslips.BetSlipEntity;
import com.betolyn.features.betting.betslips.findmybetslips.FindMyBetSlipsUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindMyBetsUC implements IUseCaseNoParams<List<BetSlipEntity>> {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindMyBetSlipsUC findMyBetSlipsUC;

    @Override
    public List<BetSlipEntity> execute() {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        return findMyBetSlipsUC.execute(loggedUser.getId());
    }
}
