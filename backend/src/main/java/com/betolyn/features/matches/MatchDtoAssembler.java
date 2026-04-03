package com.betolyn.features.matches;

import org.springframework.stereotype.Service;

import com.betolyn.features.user.UserMapper;

import lombok.RequiredArgsConstructor;

/**
 * Single entry point for building {@link MatchDTO} for HTTP and nested payloads. Encodes
 * {@link MatchTypeEnum#DERIVED} merge rules (fixture from official; markets from this row) vs
 * plain MapStruct mapping for {@link MatchTypeEnum#OFFICIAL} / {@link MatchTypeEnum#CUSTOM}.
 *
 * <p>Call sites should prefer these methods over {@link MatchMapper} directly so merge behavior
 * stays in one place.
 */
@Service
@RequiredArgsConstructor
public class MatchDtoAssembler {

    private final UserMapper userMapper;
    private final MatchMapper matchMapper;

    /**
     * Full match: detail screen, create/update responses, official match list, SSE payloads.
     * Includes main criterion / odds when present; derived rows are merged with official fixture data.
     */
    public MatchDTO forMatchDetail(MatchEntity match) {
        return buildForRead(match, false);
    }

    /**
     * Space event list and create-space-match response: omits main criterion / odds for
     * {@link MatchTypeEnum#DERIVED} only (custom space events still expose markets).
     */
    public MatchDTO forSpaceEventResponse(MatchEntity match) {
        return buildForRead(match, match.getType() == MatchTypeEnum.DERIVED);
    }

    /**
     * Nested {@code criterion.match}: merged fixture for derived; strips markets on the nested DTO
     * to avoid duplicating the parent criterion as {@code match.mainCriterion}.
     */
    public MatchDTO forNestedUnderCriterion(MatchEntity match) {
        return buildForRead(match, true);
    }

    private MatchDTO buildForRead(MatchEntity match, boolean stripMarkets) {
        if (match.getType() != MatchTypeEnum.DERIVED) {
            if (stripMarkets) {
                return matchMapper.mapEntityOmittingMainCriterion(match);
            }
            return matchMapper.mapEntityToDto(match);
        }

        var official = match.getOfficialMatch();
        if (official == null) {
            throw new IllegalStateException("Derived match missing officialMatch: " + match.getId());
        }
        if (official.getType() != MatchTypeEnum.OFFICIAL) {
            throw new IllegalStateException("Derived match must reference an official match: " + match.getId());
        }

        MatchDTO dto = new MatchDTO();
        dto.setId(match.getId());
        dto.setType(MatchTypeEnum.DERIVED);
        dto.setOfficialMatchId(official.getId());
        dto.setSpaceId(match.getSpaceId());

        dto.setHomeTeam(official.getHomeTeam());
        dto.setAwayTeam(official.getAwayTeam());

        dto.setStatus(official.getStatus());
        dto.setHomeTeamScore(official.getHomeTeamScore());
        dto.setAwayTeamScore(official.getAwayTeamScore());

        dto.setStartTime(official.getStartTime());
        dto.setEndTime(official.getEndTime());
        dto.setCreatedBy(userMapper.toDTO(match.getCreatedBy()));
        dto.setUpdatedBy(userMapper.toDTO(match.getUpdatedBy()));
        dto.setReservedLiability(match.getReservedLiability());
        dto.setMaxReservedLiability(match.getMaxReservedLiability());

        if (stripMarkets) {
            dto.setMainCriterion(null);
        } else {
            dto.setMainCriterion(
                    MatchMapper.mainCriterionEntityToMainCriterionDTO(match.getMainCriterion()));
        }

        return dto;
    }
}
