package com.betolyn.features.betting.odds.dto;
import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.odds.OddStatusEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class OddDTO {
    private String id;
    private String name;
    private double value;
    private CriterionDTO criterion;
    private OddStatusEnum status;

//    @JsonIgnoreProperties("odd") // avoid self reference lastOdd <-> odd
    private OddHistoryDTO lastOddHistory;
}
