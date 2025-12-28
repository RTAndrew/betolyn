package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateOddRequestDTO;
import com.betolyn.utils.GenerateId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OddService implements IOddService{
    private final OddRepository oddRepository;
    private final CriterionService criterionService;


    @Override
    public OddEntity findById(String id) {
        return oddRepository.findById(id).orElseThrow();
    }

    @Override
    public List<OddEntity> findAll() {
        return oddRepository.findAll();
    }

    @Override
    public OddEntity save(CreateOddRequestDTO data) {
        OddEntity odd = new OddEntity();
        odd.setName(data.getName());
        odd.setValue(data.getValue());
        odd.setMinimumAmount(data.getMinimumAmount());
        odd.setMaximumAmount(data.getMaximumAmount());
        odd.setId(new GenerateId(12, "od").generate());

        if(data.getCriterionId() != null) {
            CriterionEntity criterion = criterionService.findById(data.getCriterionId());
            odd.setCriterion(criterion);
        }

        return oddRepository.save(odd);
    }
}
