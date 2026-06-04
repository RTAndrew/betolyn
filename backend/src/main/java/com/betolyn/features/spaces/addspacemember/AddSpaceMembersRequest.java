package com.betolyn.features.spaces.addspacemember;

import lombok.NonNull;

import java.util.List;

public record AddSpaceMembersRequest(@NonNull List<String> users) {
}
