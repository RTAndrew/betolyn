package com.betolyn.features.me.findmybets;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.betting.betslips.BetSlipItemEntity;
import com.betolyn.features.betting.betslips.BetSlipItemRepository;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindMyBetSlipItemByIdUC implements IUseCase<String, BetSlipItemEntity> {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final BetSlipItemRepository betSlipItemRepository;
    private final MatchRepository matchRepository;

    @Override
    public BetSlipItemEntity execute(String betSlipItemId) {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var item = betSlipItemRepository
                .findByIdAndOwnerId(betSlipItemId, loggedUser.getId())
                .orElseThrow(EntityNotfoundException::new);

        patchCriterionMatchFromItemMatchId(item);

        return item;
    }

    private void patchCriterionMatchFromItemMatchId(BetSlipItemEntity item) {
        if (item.getMatchId() == null || item.getOdd() == null || item.getOdd().getCriterion() == null) {
            return;
        }

        var criterion = item.getOdd().getCriterion();
        if (criterion.getMatch() != null && item.getMatchId().equals(criterion.getMatch().getId())) {
            return;
        }

        matchRepository.findByIdWithTeams(item.getMatchId()).ifPresent(criterion::setMatch);
    }
}
