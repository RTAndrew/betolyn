package com.betolyn.features.betting.criterion.suspendcriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSseEvent;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.findcriterionbyid.FindCriterionByIdUC;
import com.betolyn.features.betting.criterion.updatecriterionstatus.CriterionStatusChangedEventDTO;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.betting.odds.dto.OddStatusChangedEventDTO;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.OddSseEvent;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.saveandsyncodd.SaveAndSyncOddUseCase;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SuspendCriterionUC implements IUseCase<String, CriterionEntity> {
    private final FindCriterionByIdUC findCriterionByIdUC;
    private final OddRepository oddRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final CriterionSystemEvent criterionSystemEvent;
    private final OddSystemEvent oddSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public CriterionEntity execute(String criterionId) {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var foundCriterion = findCriterionByIdUC.execute(criterionId);
        domainPermissionService.assertCanMutateCriterion(authenticatedUser, foundCriterion);
        if (foundCriterion.getStatus() == CriterionStatusEnum.SUSPENDED) {
            throw new BusinessRuleException("ALREADY_SUSPENDED", "Criterion is already suspended");
        }
        foundCriterion.setStatus(CriterionStatusEnum.SUSPENDED);

        var odds = oddRepository.findAllByCriterionId(criterionId);
        var active = odds.stream().filter(o -> o.getStatus() == OddStatusEnum.ACTIVE).toList();
        active.forEach(o -> o.setStatus(OddStatusEnum.SUSPENDED));
        if (!active.isEmpty()) {
            saveAndSyncOddUseCase.execute(active);
        }

        var affectedOddIds = active.stream().map(o -> o.getId()).toList();
        var eventDTO = new CriterionStatusChangedEventDTO(
                foundCriterion.getId(),
                        foundCriterion.getMatch().getId(),
                foundCriterion.getStatus(),
                affectedOddIds
        );

        criterionSystemEvent.publish(this, new CriterionSseEvent.CriterionSuspended(eventDTO));

        if (!active.isEmpty()) {
            oddSystemEvent.publish(this, new OddSseEvent.OddStatusChanged(
                    new OddStatusChangedEventDTO(affectedOddIds, OddStatusEnum.SUSPENDED)));
        }

        return foundCriterion;
    }
}
