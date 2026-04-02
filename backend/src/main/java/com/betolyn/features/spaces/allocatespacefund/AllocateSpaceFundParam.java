package com.betolyn.features.spaces.allocatespacefund;

import com.betolyn.shared.money.BetMoney;

public record AllocateSpaceFundParam(String spaceId, String memo, BetMoney amount) {}