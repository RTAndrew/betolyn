package com.betolyn.features.betting.odds.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;
import com.betolyn.features.user.UserDTO;
import lombok.Data;

@Data
public class OddHistoryDTO {
    private String id;
    private String name;
    private double value;
    private OddStatusEnum status;
//    private OddDTO odd; // this is not used in the OddDTO
    private UserDTO createdBy;
    private UserDTO updatedBy;
}
