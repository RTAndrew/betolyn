package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.odds.dto.OddDTO;
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
    private final OddHistoryRepository oddHistoryRepository;

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
    @Transactional
    public OddDTO save(CreateOddRequestDTO data) {
        OddEntity odd = new OddEntity();
        odd.setName(data.getName());
        odd.setValue(data.getValue());
        odd.setMinimumAmount(data.getMinimumAmount());
        odd.setMaximumAmount(data.getMaximumAmount());

        if (data.getCriterionId() != null) {
            var criterion = criterionRepository.findById(data.getCriterionId()).orElseThrow();
            odd.setCriterion(criterion);
        }

        var savedOdd = oddRepository.saveAndFlush(odd);

        var oddHistory = new OddHistoryEntity();
        oddHistory.setOdd(odd);
        oddHistory.setValue(odd.getValue());
        oddHistory.setMinimumAmount(odd.getMinimumAmount());
        oddHistory.setMaximumAmount(odd.getMaximumAmount());
        oddHistory.setStatus(OddStatusEnum.ACTIVE);
        oddHistoryRepository.saveAndFlush(oddHistory);

        return oddMapper.toOddDTO(savedOdd);
    }


    /**
     * Saves odds and oddsHistory in a transaction
     */
    @Transactional
    public List<OddDTO> save(List<OddEntity> odds) {
        var savedOdds = oddRepository.saveAllAndFlush(odds);
        List<OddHistoryEntity> oddHistoryList = savedOdds.stream().map(odd -> {
            var tempOddHistory = new OddHistoryEntity();
            tempOddHistory.setOdd(odd);
            tempOddHistory.setValue(odd.getValue());
            tempOddHistory.setMinimumAmount(odd.getMinimumAmount());
            tempOddHistory.setMaximumAmount(odd.getMaximumAmount());
            tempOddHistory.setStatus(OddStatusEnum.ACTIVE);
            return tempOddHistory;
        }).toList();

        oddHistoryRepository.saveAllAndFlush(oddHistoryList);
        return savedOdds.stream().map(oddMapper::toOddDTO).toList();
    }
}
