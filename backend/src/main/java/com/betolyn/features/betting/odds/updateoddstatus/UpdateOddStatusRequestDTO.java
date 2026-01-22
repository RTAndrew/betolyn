package com.betolyn.features.betting.odds.updateoddstatus;

import com.betolyn.features.betting.odds.OddStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOddStatusRequestDTO {
    @NotNull
    private OddStatusEnum status;
}
