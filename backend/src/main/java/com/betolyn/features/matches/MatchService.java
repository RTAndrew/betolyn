package com.betolyn.features.matches;

import com.betolyn.features.betting.criterion.CriterionEntity;
import com.betolyn.features.betting.criterion.CriterionMapper;
import com.betolyn.features.betting.criterion.CriterionRepository;
import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.features.matches.dto.UpdateMatchMainCriterionRequestDTO;
import com.betolyn.features.matches.dto.UpdateMatchRequestDTO;
import com.betolyn.features.matches.mapper.MatchMapper;
import com.betolyn.features.matches.matchSystemEvents.MatchSystemEvent;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService implements IMatchService {
    private final MatchMapper matchMapper;
    private final TeamService teamService;
    private final MatchRepository matchRepository;
    private final CriterionRepository criterionRepository;
    private final MatchSystemEvent matchSystemEvent;

    @Override
    public List<MatchDTO> findAll() {
        return matchRepository.findAll().stream().map(matchMapper::toMatchDTO).toList();
    }

    @Override
    public MatchEntity findById(String id) throws EntityNotfoundException {
        return matchRepository.findById(id).orElseThrow(EntityNotfoundException::new);
    }

    @Override
    @Transactional
    public MatchEntity updateById(String id, UpdateMatchRequestDTO requestDTO) {
        var match = this.matchRepository.findById(id).orElseThrow(EntityNotfoundException::new);
        var mappedMatch = matchMapper.toEntity(requestDTO, match);

        var savedMatch = matchRepository.save(mappedMatch);

        matchSystemEvent.publicMatchUpdate(this, savedMatch);
        return savedMatch;
    }

    public List<CriterionEntity> findAllCriteriaByMatchId(String matchId) {
        this.findById(matchId);
        return criterionRepository.findAllByMatchId(matchId);

    }

    @Override
    public MatchDTO createMatch(CreateMatchRequestDTO requestDTO) {
        var homeTeam = teamService.findById(requestDTO.getHomeTeamId());
        var awayTeam = teamService.findById(requestDTO.getAwayTeamId());

        MatchEntity entity = new MatchEntity();
        entity.setHomeTeam(homeTeam);
        entity.setAwayTeam(awayTeam);

        var match = matchRepository.save(entity);
        return matchMapper.toMatchDTO(match);
    }

    @Override
    public MatchEntity updateMainCriterion(String matchId, UpdateMatchMainCriterionRequestDTO data) {
        var match = this.findById(matchId);
        var criterion = criterionRepository.findById(data.criterionId()).orElseThrow(() -> new EntityNotfoundException("ENTITY_NOT_FOUND", "Criterion not found"));

        if (!criterion.getMatch().getId().equals(matchId)) {
            throw new CriterionDoesNotBelongToMatchException();
        }

        match.setMainCriterion(criterion);
        return matchRepository.save(match);
    }
}
