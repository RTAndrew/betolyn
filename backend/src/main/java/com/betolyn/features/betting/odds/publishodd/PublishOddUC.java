package com.betolyn.features.betting.odds.publishodd;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.odds.*;
import com.betolyn.features.betting.odds.findoddbyid.FindOddByIdUC;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PublishOddUC implements IUseCase<String, OddEntity> {
    private static final Set<OddStatusEnum> ALLOWED_CRITERION_STATUSES = Set.of(OddStatusEnum.SUSPENDED,
            OddStatusEnum.DRAFT);

    private final FindOddByIdUC findOddByIdUC;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public OddEntity execute(String oddId) {
        var foundOdd = findOddByIdUC.execute(oddId);

        if (!ALLOWED_CRITERION_STATUSES.contains(foundOdd.getStatus())) {
            throw new OddCannotPublishException();
        }

        foundOdd.setStatus(OddStatusEnum.ACTIVE);

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(foundOdd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        oddSystemEvent.publish(this, "oddStatusChanged",
                new OddStatusChangedEventDTO(List.of(oddId), OddStatusEnum.ACTIVE));
        return savedOdd.get();
    }
}
