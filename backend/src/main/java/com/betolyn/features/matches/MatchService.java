package com.betolyn.features.matches;

import com.betolyn.features.auth.UserEntity;
import com.betolyn.features.auth.UserService;
import com.betolyn.features.matches.DTOs.CreateMatchRequestDTO;
import com.betolyn.utils.GenerateId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService implements IMatchService {
    private final UserService userService;
    private final TeamService teamService;
    private final MatchRepository matchRepository;

    @Override
    public List<MatchEntity> findAll() {
        return matchRepository.findAll();
    }

    @Override
    public MatchEntity createMatch(CreateMatchRequestDTO requestDTO) {
        UserEntity user = userService.getUserById("u_1EEnlHt38iE4");
        var homeTeam = teamService.findById(requestDTO.getHomeTeamId());
        var awayTeam = teamService.findById(requestDTO.getAwayTeamId());


        MatchEntity entity = new MatchEntity();
        entity.setId(new GenerateId(12, "match").generate());
        entity.setUser(user);
        entity.setHomeTeam(homeTeam);
        entity.setAwayTeam(awayTeam);

        return matchRepository.save(entity);
    }
}
