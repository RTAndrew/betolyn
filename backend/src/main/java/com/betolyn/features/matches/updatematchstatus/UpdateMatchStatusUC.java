package com.betolyn.features.matches.updatematchstatus;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.features.matches.matchSystemEvents.MatchProgressChangedEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSseEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.features.matches.matchSystemEvents.MatchVoidedEventDTO;
import com.betolyn.features.betting.criterion.suspendcriterion.SuspendBulkCriterionUC;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateMatchStatusUC implements IUseCase<UpdateMatchStatusParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;
    private final SuspendBulkCriterionUC suspendBulkCriterionUC;

    @Override
    @Transactional
    public MatchEntity execute(UpdateMatchStatusParam param) throws MatchNotFoundException {
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);

        var requestDTO = param.requestDTO();
        var previousStatus = match.getStatus();

        if (requestDTO.getStatus() == MatchStatusEnum.ENDED
                && Boolean.TRUE.equals(requestDTO.getSuspendAllCriteria())) {
            suspendBulkCriterionUC.execute(match.getId());
        }

        match.setStatus(requestDTO.getStatus());

        var savedMatch = matchRepository.save(match);
        
        if (savedMatch.getStatus() == MatchStatusEnum.CANCELLED) {
            var voidedEventDTO = new MatchVoidedEventDTO(savedMatch.getId());
            matchSystemEvent.publish(this, new MatchSseEvent.MatchVoided(voidedEventDTO));
        } else {
            var progressEventDTO = new MatchProgressChangedEventDTO(savedMatch.getId(), previousStatus, savedMatch.getStatus());
            matchSystemEvent.publish(this, new MatchSseEvent.MatchProgressChanged(progressEventDTO));
        }

        return savedMatch;
    }
}
