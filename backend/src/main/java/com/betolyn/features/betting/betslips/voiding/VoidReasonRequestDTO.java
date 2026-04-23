package com.betolyn.features.betting.betslips.voiding;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VoidReasonRequestDTO {
    @NotBlank
    private String reason;
}
