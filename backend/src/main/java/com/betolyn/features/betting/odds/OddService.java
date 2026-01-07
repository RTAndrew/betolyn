package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.criterion.CriterionService;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.odds.dto.OddDTO;
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
    public List<OddDTO> findAll() {
        return oddRepository.findAll().stream().map(oddMapper::toOddDTO).toList();
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
