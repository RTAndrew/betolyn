package com.betolyn.features.betting;

import com.betolyn.features.betting.dtos.CreateOddRequestDTO;
import com.betolyn.features.betting.dtos.OddDTO;
import com.betolyn.features.betting.mapper.CriterionMapper;
import com.betolyn.features.betting.mapper.OddMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OddService implements IOddService{
    private final OddMapper oddMapper;
    private final OddRepository oddRepository;
    private final CriterionMapper criterionMapper;
    private final CriterionService criterionService;


    @Override
    public OddDTO findById(String id) {
        var odd = oddRepository.findById(id).orElseThrow(() -> new RuntimeException("Entity not found"));
        return oddMapper.toOddDTO(odd);
    }

    @Override
    public List<OddEntity> findAll() {
        return oddRepository.findAll();
    }

    @Override
    public OddDTO save(CreateOddRequestDTO data) {
        OddEntity odd = new OddEntity();
        odd.setName(data.getName());
        odd.setValue(data.getValue());
        odd.setMinimumAmount(data.getMinimumAmount());
        odd.setMaximumAmount(data.getMaximumAmount());

        if(data.getCriterionId() != null) {
            var criterion = criterionService.findById(data.getCriterionId());
            odd.setCriterion(criterionMapper.toCriterionEntity(criterion));
        }

        var savedOdd = oddRepository.save(odd);
        return oddMapper.toOddDTO(savedOdd);
    }
}
