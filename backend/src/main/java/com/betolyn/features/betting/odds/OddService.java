package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.betting.odds.dto.UpdateOddRequestDTO;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OddService implements IOddService {
    private final OddMapper oddMapper;
    private final OddRepository oddRepository;
    private final CriterionRepository criterionRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;

    @Override
    public OddEntity findById(String id) {
        return oddRepository.findById(id).orElseThrow(() -> new RuntimeException("Entity not found"));
    }

    public List<OddEntity> findAllByCriterionId(String criterionId) {
        return oddRepository.findAllByCriterionId(criterionId);
    }

    @Override
    public List<OddDTO> findAll() {
        var odds = oddRepository.findAll();
        return odds.stream().map(oddMapper::toOddDTO).toList();
    }

    @Override
    @Transactional
    public OddDTO save(CreateOddRequestDTO data) {
        OddEntity odd = new OddEntity();
        odd.setName(data.getName());
        odd.setValue(data.getValue());

        if (data.getCriterionId() != null) {
            var criterion = criterionRepository.findById(data.getCriterionId()).orElseThrow();
            odd.setCriterion(criterion);
        }

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(odd)).stream().findFirst();
        if (savedOdd.isEmpty()) throw new InternalServerException("It was not possible to save the entity");

        return oddMapper.toOddDTO(savedOdd.get());
    }


    /**
     * Saves odds and oddsHistory in a transaction
     */
    @Transactional
    public List<OddEntity> save(List<OddEntity> odds) {
        this.checkIfOddsAreActiveOrThrow(odds);

        return saveAndSyncOddUseCase.execute(odds);
    }

    @Transactional
    public List<OddEntity> update(List<OddEntity> odds) {
        // 1. Check if the incoming odds have status.ACTIVE
        this.checkIfOddsAreActiveOrThrow(odds);

        // 2. Fetch all incoming odds and check if they have status.ACTIVE
        List<String> oddIdArray = odds.stream().map(BaseEntity::getId).toList();
        var foundOdds = oddRepository.findAllById(oddIdArray);
        this.checkIfOddsAreActiveOrThrow(foundOdds);

        // 3. Save
        return saveAndSyncOddUseCase.execute(odds);
    }

    @Transactional
    public OddEntity update(String oddId, UpdateOddRequestDTO odd) {
        var foundOdd = this.findById(oddId);

        if (odd.getValue() != null) {
            foundOdd.setValue(odd.getValue());
        }

        if (odd.getStatus() != null) {
            // Cannot set/revert an odd to draft
            if (odd.getStatus() == OddStatusEnum.DRAFT) {
                throw new OddCannotUpdateToDraftException();
            }

            foundOdd.setStatus(odd.getStatus());
        }

        var savedOdd = saveAndSyncOddUseCase.execute(List.of(foundOdd)).stream().findFirst();
        if (savedOdd.isEmpty()) throw new InternalServerException("It was not possible to save the entity");
        return savedOdd.get();
    }


    protected void checkIfOddsAreActiveOrThrow(List<OddEntity> odds) {
        boolean hasInvalid = odds.stream().anyMatch(odd -> odd.getStatus() != OddStatusEnum.ACTIVE);

        if (hasInvalid) {
            throw new BusinessRuleException("INVALID_ODDS", "Only odds with active state are allowed to be edited");
        }
    }
}
