package com.betolyn.features.betting.odds.updateoddvalue;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.auth.permissions.DomainPermissionService;
import com.betolyn.features.betting.betslips.OddPrice;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddSseEvent;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.dto.OddValueChangeDirection;
import com.betolyn.features.betting.odds.dto.OddValueChangedEventDTO;
import com.betolyn.features.betting.odds.saveandsyncodd.SaveAndSyncOddUseCase;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UpdateOddValueUC implements IUseCase<UpdateOddValueParam, OddEntity> {
    private final FindOddByIdUC findOddByIdUC;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddSystemEvent oddSystemEvent;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final DomainPermissionService domainPermissionService;

    @Override
    @Transactional
    public OddEntity execute(UpdateOddValueParam param) {
        OddValueChangeDirection oddValueChangeDirection;
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var foundOdd = findOddByIdUC.execute(param.oddId());
        domainPermissionService.assertCanMutateOdd(authenticatedUser, foundOdd);

        BigDecimal newValue = param.requestDTO().getValue();
        if (foundOdd.getValue().toBigDecimal().compareTo(newValue) == 0) {
            throw new BusinessRuleException("INVALID_ODD_VALUE", "The odd value cannot be the same as the previous one");
        }

        oddValueChangeDirection = newValue.compareTo(foundOdd.getValue().toBigDecimal()) > 0
                ? OddValueChangeDirection.UP
                : OddValueChangeDirection.DOWN;

        foundOdd.setValue(new OddPrice(newValue));
        var savedOdd = saveAndSyncOddUseCase.execute(List.of(foundOdd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        var eventDTO = new OddValueChangedEventDTO(savedOdd.get().getId(), oddValueChangeDirection, savedOdd.get().getValue().toBigDecimal());
        oddSystemEvent.publish(this, new OddSseEvent.OddValueChanged(eventDTO));
        return savedOdd.get();
    }
}
