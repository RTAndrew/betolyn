package com.betolyn.features.betting.betslips.bulkvoidodd;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VoidReasonRequestDTO {
    @NotBlank
    private String reason;
}
