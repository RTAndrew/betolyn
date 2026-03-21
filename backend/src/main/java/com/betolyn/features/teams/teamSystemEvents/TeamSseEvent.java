package com.betolyn.features.teams.teamSystemEvents;

public sealed interface TeamSseEvent permits TeamSseEvent.TeamCreated {

    String eventName();

    Object payload();

    record TeamCreated(TeamCreatedEventDTO data) implements TeamSseEvent {
        @Override
        public String eventName() {
            return "teamCreated";
        }

        @Override
        public Object payload() {
            return data;
        }
    }
}
