package com.betolyn.features.spaces.findspacematches;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.matches.MatchEntity;
import com.betolyn.features.matches.MatchRepository;
import com.betolyn.features.matches.MatchTypeEnum;
import com.betolyn.features.spaces.findspacebyid.FindSpaceByIdUC;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindSpaceMatchesUC implements IUseCase<String, List<MatchEntity>> {
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final MatchRepository matchRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MatchEntity> execute(String spaceId) {
        findSpaceByIdUC.execute(spaceId);
        return matchRepository
                .findBySpaceIdAndTypeIn(spaceId, List.of(MatchTypeEnum.CUSTOM, MatchTypeEnum.DERIVED))
                .stream()
                .sorted(Comparator.comparing(
                        FindSpaceMatchesUC::effectiveStartTimeForSort,
                        Comparator.nullsLast(String::compareTo)))
                .toList();
    }

    private static String effectiveStartTimeForSort(MatchEntity m) {
        if (m.getType() == MatchTypeEnum.DERIVED && m.getOfficialMatch() != null) {
            return m.getOfficialMatch().getStartTime();
        }
        return m.getStartTime();
    }
}
