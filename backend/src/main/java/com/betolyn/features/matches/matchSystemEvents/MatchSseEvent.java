package com.betolyn.features.matches.matchSystemEvents;

public sealed interface MatchSseEvent permits MatchSseEvent.MatchVoided,
        MatchSseEvent.MatchProgressChanged,
        MatchSseEvent.ScoreChanged,
        MatchSseEvent.Rescheduled,
        MatchSseEvent.MatchCreated {

    String eventName();

    Object payload();

    record MatchVoided(MatchVoidedEventDTO data) implements MatchSseEvent {
        @Override
        public String eventName() {
            return "matchVoided";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record MatchProgressChanged(MatchProgressChangedEventDTO data) implements MatchSseEvent {
        @Override
        public String eventName() {
            return "matchProgressChanged";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record ScoreChanged(MatchScoreChangedEventDTO data) implements MatchSseEvent {
        @Override
        public String eventName() {
            return "scoreChanged";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record Rescheduled(MatchRescheduledEventDTO data) implements MatchSseEvent {
        @Override
        public String eventName() {
            return "rescheduled";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record MatchCreated(MatchCreatedEventDTO data) implements MatchSseEvent {
        @Override
        public String eventName() {
            return "matchCreated";
        }

        @Override
        public Object payload() {
            return data;
        }
    }
}
