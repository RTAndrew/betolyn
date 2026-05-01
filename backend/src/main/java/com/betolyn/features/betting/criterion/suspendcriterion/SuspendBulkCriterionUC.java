package com.betolyn.features.betting.criterion.suspendcriterion;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSseEvent;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.updatecriterionstatus.CriterionStatusChangedEventDTO;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.OddSseEvent;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.dto.OddStatusChangedEventDTO;
import com.betolyn.features.betting.odds.saveandsyncodd.SaveAndSyncOddUseCase;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuspendBulkCriterionUC implements IUseCase<String, List<CriterionEntity>> {
    private final CriterionRepository criterionRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final CriterionSystemEvent criterionSystemEvent;
    private final OddSystemEvent oddSystemEvent;
    private final FindMatchByIdUC findMatchByIdUC;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public List<CriterionEntity> execute(String matchId) {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var match = findMatchByIdUC.execute(matchId);
        domainPermissionService.assertCanMutateMatch(authenticatedUser, match);

        var criteria = criterionRepository.findAllByMatchId(
                matchId,
                List.of(CriterionStatusEnum.ACTIVE, CriterionStatusEnum.DRAFT)
        );

        for (var criterion : criteria) {
            if (criterion.getStatus() == CriterionStatusEnum.SUSPENDED) {
                continue;
            }

            criterion.setStatus(CriterionStatusEnum.SUSPENDED);
            var savedCriterion = criterionRepository.save(criterion);

            var active = savedCriterion.getOdds().stream()
                    .filter(o -> o.getStatus() == OddStatusEnum.ACTIVE)
                    .toList();
            active.forEach(o -> o.setStatus(OddStatusEnum.SUSPENDED));
            if (!active.isEmpty()) {
                saveAndSyncOddUseCase.execute(active);
            }

            var affectedOddIds = active.stream().map(o -> o.getId()).toList();
            var eventDTO = new CriterionStatusChangedEventDTO(
                    savedCriterion.getId(),
                    savedCriterion.getMatch().getId(),
                    savedCriterion.getStatus(),
                    affectedOddIds);

            criterionSystemEvent.publish(this, new CriterionSseEvent.CriterionSuspended(eventDTO));

            if (!active.isEmpty()) {
                oddSystemEvent.publish(this, new OddSseEvent.OddStatusChanged(
                        new OddStatusChangedEventDTO(affectedOddIds, OddStatusEnum.SUSPENDED)));
            }
        }

        return criteria;
    }
}

