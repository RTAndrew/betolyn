package com.betolyn.features.betting.odds.dto;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.matches.MatchDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class OddDTO {
    private String id;
    private String matchId;

    private String name;
    private double value;
    private Boolean isWinner = false;

    private Integer totalBetsCount = 0;
    private Double totalStakesVolume = 0.0;
    private Double potentialPayoutVolume = 0.0;

    @JsonIgnoreProperties({"match", "odds"}) // avoid self reference
    private CriterionDTO criterion;
    private OddStatusEnum status;

    @JsonIgnoreProperties("odd") // avoid self reference lastOdd <-> odd
    private OddHistoryDTO lastOddHistory;
}
