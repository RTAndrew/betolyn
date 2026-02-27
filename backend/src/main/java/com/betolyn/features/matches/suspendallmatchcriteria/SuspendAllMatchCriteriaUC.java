package com.betolyn.features.matches.suspendallmatchcriteria;

import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.CriterionSystemEvent;
import com.betolyn.features.betting.criterion.updatecriterionstatus.CriterionStatusChangedEventDTO;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.betting.odds.OddSystemEvent;
import com.betolyn.features.betting.odds.dto.OddStatusChangedEventDTO;
import com.betolyn.features.betting.odds.saveandsyncodd.SaveAndSyncOddUseCase;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuspendAllMatchCriteriaUC implements IUseCase<String, List<CriterionEntity>> {
    private final MatchRepository matchRepository;
    private final CriterionRepository criterionRepository;
    private final OddRepository oddRepository;
    private final SaveAndSyncOddUseCase saveAndSyncOddUseCase;
    private final CriterionSystemEvent criterionSystemEvent;
    private final OddSystemEvent oddSystemEvent;

    @Override
    @Transactional
    public List<CriterionEntity> execute(String matchId) {
        var match = matchRepository.findById(matchId).orElseThrow(MatchNotFoundException::new);

        var activeCriteria = criterionRepository.findAllByMatchId(matchId, List.of(CriterionStatusEnum.ACTIVE));
        
        if (activeCriteria.isEmpty()) {
            return new ArrayList<>();
        }

        activeCriteria.forEach(criterion -> criterion.setStatus(CriterionStatusEnum.SUSPENDED));
        var savedCriteria = criterionRepository.saveAll(activeCriteria);

        for (var criterion : savedCriteria) {
            var odds = oddRepository.findAllByCriterionId(criterion.getId());
            var activeOdds = odds.stream()
                    .filter(o -> o.getStatus() == OddStatusEnum.ACTIVE)
                    .toList();
            
            activeOdds.forEach(o -> o.setStatus(OddStatusEnum.SUSPENDED));
            
            if (!activeOdds.isEmpty()) {
                saveAndSyncOddUseCase.execute(activeOdds);
            }

            var affectedOddIds = activeOdds.stream().map(o -> o.getId()).toList();
            var eventDTO = new CriterionStatusChangedEventDTO(
                    criterion.getId(),
                    criterion.getMatch().getId(),
                    criterion.getStatus(),
                    affectedOddIds
            );
            criterionSystemEvent.publish(this, "criterionSuspended", eventDTO);
            
            if (!activeOdds.isEmpty()) {
                oddSystemEvent.publish(this, "oddStatusChanged", 
                    new OddStatusChangedEventDTO(affectedOddIds, OddStatusEnum.SUSPENDED));
            }
        }

        return savedCriteria;
    }
}
