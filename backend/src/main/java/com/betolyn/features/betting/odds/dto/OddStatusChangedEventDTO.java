package com.betolyn.features.betting.odds.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;

import java.util.List;

public record OddStatusChangedEventDTO(List<String> odds, OddStatusEnum status) {
}
