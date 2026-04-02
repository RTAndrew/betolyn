package com.betolyn.features.spaces.allocatespacefund;

import com.betolyn.shared.money.BetMoney;

public record AllocateSpaceFundRequest(String memo, BetMoney amount) {}
