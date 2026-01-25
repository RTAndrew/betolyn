package com.betolyn.features.betting.odds.createodd;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddMapper;
import com.betolyn.features.betting.odds.SaveAndSyncOddUseCase;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateOddUC implements IUseCase<CreateOddRequestDTO, OddEntity> {
    private final CriterionRepository criterionRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final OddMapper oddMapper;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public OddEntity execute(CreateOddRequestDTO data) {
        OddEntity odd = new OddEntity();
        odd.setName(data.getName());
        odd.setValue(data.getValue());

        if (data.getCriterionId() != null) {
            var criterion = criterionRepository.findById(data.getCriterionId()).orElseThrow();
            odd.setCriterion(criterion);
        }

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(odd)).stream().findFirst();
        if (savedOdd.isEmpty()) {
            throw new InternalServerException("It was not possible to save the entity");
        }

        oddSystemEvent.publish(this, "oddCreated", oddMapper.toOddDTO(savedOdd.get()));

        return savedOdd.get();
    }
}
