package com.betolyn.features.betting.odds.createodd;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.odds.*;
import com.betolyn.shared.exceptions.BadRequestException;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

record CreateOddEventDTO (String oddId, String criterionId, String matchId, OddStatusEnum status){}

@Service
@RequiredArgsConstructor
public class CreateOddUC implements IUseCase<CreateOddRequestDTO, OddEntity> {
    private final List<OddStatusEnum> ALLOWED_STATUSES = List.of(OddStatusEnum.DRAFT, OddStatusEnum.ACTIVE);
    private final CriterionRepository criterionRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public OddEntity execute(CreateOddRequestDTO data) {
        if(data.getStatus() == null) {
            data.setStatus(OddStatusEnum.DRAFT);
        }


        if(!ALLOWED_STATUSES.contains(data.getStatus())) {
            throw new BadRequestException("NOT_ALLOWED", "Not allowed");
        }

        OddEntity odd = new OddEntity();
        odd.setName(data.getName());
        odd.setValue(data.getValue());
        odd.setStatus(data.getStatus());

        if (data.getCriterionId() != null) {
            var criterion = criterionRepository.findById(data.getCriterionId()).orElseThrow();
            odd.setCriterion(criterion);
        }

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(odd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        var eventDTO = new CreateOddEventDTO(
                savedOdd.get().getId(),
                savedOdd.get().getCriterion().getId(),
                savedOdd.get().getCriterion().getMatch().getId(),
                savedOdd.get().getStatus()
        );
        oddSystemEvent.publish(this, "oddCreated", eventDTO);

        return savedOdd.get();
    }
}
