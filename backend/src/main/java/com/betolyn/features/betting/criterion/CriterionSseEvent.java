package com.betolyn.features.betting.criterion;

import com.betolyn.features.betting.criterion.dto.CriterionDTO;
import com.betolyn.features.betting.criterion.dto.CriterionRefreshRequiredEventDTO;
import com.betolyn.features.betting.criterion.dto.CriterionVoidedEventDTO;
import com.betolyn.features.betting.criterion.publishcriterion.PublishCriterionEventDTO;
import com.betolyn.features.betting.criterion.updatecriterionstatus.CriterionStatusChangedEventDTO;

public sealed interface CriterionSseEvent permits CriterionSseEvent.CriterionCreated,
        CriterionSseEvent.RefreshRequired,
        CriterionSseEvent.CriterionStatusChanged,
        CriterionSseEvent.CriterionSuspended,
        CriterionSseEvent.CriterionVoided,
                CriterionSseEvent.CriterionUpdated,
        CriterionSseEvent.CriterionPublished {

    record CriterionCreated(CriterionDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "criterionCreated";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record RefreshRequired(CriterionRefreshRequiredEventDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "REFRESH_REQUIRED";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record CriterionStatusChanged(CriterionStatusChangedEventDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "criterionStatusChanged";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record CriterionVoided(CriterionVoidedEventDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "criterionVoided";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record CriterionSuspended(CriterionStatusChangedEventDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "criterionSuspended";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record CriterionUpdated(CriterionDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "criterionUpdated";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    record CriterionPublished(PublishCriterionEventDTO data) implements CriterionSseEvent {
        @Override
        public String eventName() {
            return "criterionPublished";
        }

        @Override
        public Object payload() {
            return data;
        }
    }

    String eventName();

    Object payload();
}
