package com.betolyn.features.matches.updatematchstatus;

import com.betolyn.features.matches.MatchStatusEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateMatchStatusRequestDTO {
    @NotNull
    private MatchStatusEnum status;
}
