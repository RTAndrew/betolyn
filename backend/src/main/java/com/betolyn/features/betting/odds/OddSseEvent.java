package com.betolyn.features.betting.odds;

import com.betolyn.features.betting.odds.dto.OddCreatedEventDTO;
import com.betolyn.features.betting.odds.dto.OddDTO;
import com.betolyn.features.betting.odds.dto.OddStatusChangedEventDTO;
import com.betolyn.features.betting.odds.dto.OddValueChangedEventDTO;

public sealed interface OddSseEvent permits OddSseEvent.OddStatusChanged,
        OddSseEvent.OddValueChanged,
        OddSseEvent.OddCreated,
        OddSseEvent.OddUpdated {

    String eventName();

    Object payload();

    record OddStatusChanged(OddStatusChangedEventDTO data) implements OddSseEvent {
        @Override
        public String eventName() {
            return "oddStatusChanged";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record OddValueChanged(OddValueChangedEventDTO data) implements OddSseEvent {
        @Override
        public String eventName() {
            return "oddValueChanged";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record OddCreated(OddCreatedEventDTO data) implements OddSseEvent {
        @Override
        public String eventName() {
            return "oddCreated";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record OddUpdated(OddDTO data) implements OddSseEvent {
        @Override
        public String eventName() {
            return "oddUpdated";
        }

        @Override
        public Object payload() {
            return data;
        }
    }
}
