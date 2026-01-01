package com.betolyn.features.matches;

import com.betolyn.features.matches.dto.CreateMatchRequestDTO;
import com.betolyn.features.matches.dto.MatchDTO;
import com.betolyn.features.matches.mapper.MatchMapper;
import com.betolyn.utils.GenerateId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService implements IMatchService {
    private final MatchMapper matchMapper;
    private final TeamService teamService;
    private final MatchRepository matchRepository;

    @Override
    public List<MatchEntity> findAll() {
        return matchRepository.findAll();
    }

    @Override
    public MatchDTO findById(String id) {
        var match = matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Entity not found"));
        return matchMapper.toMatchDTO(match);
    }

    @Override
    public MatchDTO createMatch(CreateMatchRequestDTO requestDTO) {
        var homeTeam = teamService.findById(requestDTO.getHomeTeamId());
        var awayTeam = teamService.findById(requestDTO.getAwayTeamId());

        MatchEntity entity = new MatchEntity();
        entity.setId(new GenerateId(12, "match").generate());
        entity.setHomeTeam(homeTeam);
        entity.setAwayTeam(awayTeam);

        var match =  matchRepository.save(entity);
        return matchMapper.toMatchDTO(match);
    }
}
