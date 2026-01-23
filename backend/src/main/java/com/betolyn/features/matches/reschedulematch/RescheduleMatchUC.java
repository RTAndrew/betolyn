package com.betolyn.features.matches.reschedulematch;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchStatusEnum;
import com.betolyn.features.matches.exceptions.MatchNotFoundException;
import com.betolyn.features.matches.matchSystemEvents.MatchRescheduledEventDTO;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.shared.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RescheduleMatchUC implements IUseCase<RescheduleMatchParam, MatchEntity> {
    private final MatchRepository matchRepository;
    private final MatchSystemEvent matchSystemEvent;

    @Override
    @Transactional
    public MatchEntity execute(RescheduleMatchParam param) throws MatchNotFoundException {
        var match = matchRepository.findById(param.matchId()).orElseThrow(MatchNotFoundException::new);

        var requestDTO = param.requestDTO();

        // Validate status
        if (requestDTO.getStatus() != null &&
                requestDTO.getStatus() != MatchStatusEnum.SCHEDULED &&
            requestDTO.getStatus() != MatchStatusEnum.LIVE) {
            throw new BusinessRuleException("INVALID_STATUS", "Status must be either SCHEDULED or LIVE");
        }

        match.setStartTime(requestDTO.getStartTime());

        if (requestDTO.getEndTime() != null) {
            match.setEndTime(requestDTO.getEndTime());
        }

        if (requestDTO.getStatus() != null) {
            match.setStatus(requestDTO.getStatus());
        }

        var savedMatch = matchRepository.save(match);
        
        var eventDTO = new MatchRescheduledEventDTO(savedMatch.getId(), savedMatch.getStartTime(), savedMatch.getEndTime());
        matchSystemEvent.publish(this, "rescheduled", eventDTO);

        return savedMatch;
    }
}
