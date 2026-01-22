package com.betolyn.features.matches.reschedulematch;

import com.betolyn.features.matches.MatchStatusEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RescheduleMatchRequestDTO {
    @NotNull
    private String startTime;
    
    private String endTime;
    
    @NotNull
    private MatchStatusEnum status;
}
