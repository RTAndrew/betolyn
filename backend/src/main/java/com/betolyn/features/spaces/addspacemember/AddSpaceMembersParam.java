package com.betolyn.features.spaces.addspacemember;

import lombok.NonNull;

import java.util.List;

public record AddSpaceMembersParam (@NonNull  String spaceId, @NonNull List<String> users) {
}
