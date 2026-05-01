package com.betolyn.features.betting.criterion.createcriterion;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionSseEvent;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.exceptions.MultipleOddsIsNotAllowedException;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.bulksaveodds.BulkSaveOddsUC;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateCriterionUC implements IUseCase<CreateCriterionRequestDTO, CriterionDTO> {
    private final FindMatchByIdUC findMatchByIdUC;
    private final CriterionMapper criterionMapper;
    private final CriterionRepository criterionRepository;
    private final BulkSaveOddsUC bulkSaveOddsUC;
    private final CriterionSystemEvent criterionSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public CriterionDTO execute(CreateCriterionRequestDTO data) {
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        CriterionEntity criterion = new CriterionEntity();
        criterion.setAllowMultipleOdds(data.getAllowMultipleOdds());
        criterion.setName(data.getName());

        if (data.getStatus() == null) {
            criterion.setStatus(CriterionStatusEnum.DRAFT);
        } else {
            criterion.setStatus(data.getStatus());
        }

        if (!data.getAllowMultipleOdds() && data.getOdds().size() > 1) {
            throw new MultipleOddsIsNotAllowedException();
        }

        if (data.getMatchId() != null) {
            var match = findMatchByIdUC.execute(data.getMatchId());
            domainPermissionService.assertCanMutateMatch(authenticatedUser, match);
            criterion.setMatch(match);
        } else {
            domainPermissionService.assertIsPlatformUser(authenticatedUser);
        }

        var savedCriterion = criterionRepository.saveAndFlush(criterion);
        if (data.getOdds().isEmpty()) {
            return criterionMapper.toCriterionDTO(savedCriterion);
        }

        List<OddEntity> oddList = data.getOdds().stream().map(odd -> {
            var tempOdd = new OddEntity();
            tempOdd.setName(odd.getName());
            tempOdd.setValue(new OddPrice(odd.getValue()));
            tempOdd.setCriterion(savedCriterion);
            tempOdd.setStatus(odd.getStatus() != null ? odd.getStatus() : OddStatusEnum.DRAFT);

            return tempOdd;
        }).toList();

        bulkSaveOddsUC.execute(oddList);
        var criterionDTO = criterionMapper.toCriterionDTO(savedCriterion);
        criterionSystemEvent.publish(this, new CriterionSseEvent.CriterionCreated(criterionDTO));

        return criterionDTO;
    }
}
