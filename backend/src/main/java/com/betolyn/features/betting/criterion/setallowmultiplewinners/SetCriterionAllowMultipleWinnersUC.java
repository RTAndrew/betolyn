package com.betolyn.features.betting.criterion.setallowmultiplewinners;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SetCriterionAllowMultipleWinnersUC implements IUseCase<SetAllowMultipleWinnersParam, CriterionEntity> {

    private final FindCriterionByIdUC findCriterionByIdUC;
    private final CriterionSystemEvent criterionSystemEvent;
    private final OddSystemEvent oddSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;
    private final Set<CriterionStatusEnum> NOT_ALLOWED_CRITERION_STATUSES = Set.of(CriterionStatusEnum.SETTLED,
            CriterionStatusEnum.VOID);

    @Override
    @Transactional
    public CriterionEntity execute(SetAllowMultipleWinnersParam param) {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var criterion = findCriterionByIdUC.execute(param.criterionId());
        domainPermissionService.assertCanMutateCriterion(authenticatedUser, criterion);

        if (criterion.getAllowMultipleWinners() == param.allowMultipleWinners()) {
            throw new BusinessRuleException("ALLOW_MULTIPLE_WINNERS_ALREADY_SET",
                    "Allow multiple winners is already set");
        }

        if (criterion.getMatch().getStatus() == MatchStatusEnum.CANCELLED) {
            throw new BusinessRuleException("NOT_ALLOWED_MATCH_STATUS", "Cannot make the change on a cancelled match");
        }

        if (NOT_ALLOWED_CRITERION_STATUSES.contains(criterion.getStatus())) {
            throw new BusinessRuleException("NOT_ALLOWED_STATUS", "Criterion must be active, suspended or draft");
        }

        criterion.setAllowMultipleWinners(param.allowMultipleWinners());

        // Mandatory reset all winners to false
        criterion.getOdds().forEach(odd -> odd.setIsWinner(false));
        if (!criterion.getOdds().isEmpty()) {
            oddSystemEvent.publishOddUpdate(this, criterion.getOdds());
        }

        criterionSystemEvent.publishCriterionUpdate(this, criterion);

        return criterion;
    }
}
