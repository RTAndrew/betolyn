import type { ICriterion } from '@/types';

import type { ISseEvent } from './sse-listener-factory';

import { DataSync } from '../data-sync';
import { CriterionSseEventName } from '../sse-events';
import { ISseListener } from './types';

type TEnvelope = ISseEvent<object>;

interface ICriterionChangeEvent {
  criterionId: string;
  matchId?: string;
  status?: ICriterion['status'];
}

interface ICriterionRefreshRequiredPayload {
  criterionId: string;
  matchId?: string;
  odds?: string[];
}

type CriterionSseMessage =
  | {
      eventName: typeof CriterionSseEventName.refreshRequired;
      payload: ICriterionRefreshRequiredPayload;
    }
  | { eventName: typeof CriterionSseEventName.criterionStatusChanged; payload: ICriterion }
  | { eventName: typeof CriterionSseEventName.criterionCreated; payload: ICriterion }
  | { eventName: typeof CriterionSseEventName.criterionPublished; payload: ICriterionChangeEvent }
  | { eventName: typeof CriterionSseEventName.criterionSuspended; payload: ICriterionChangeEvent }
  | { eventName: typeof CriterionSseEventName.criterionUpdated; payload: ICriterion };

function narrowCriterionSseMessage(
  eventName: string,
  payload: unknown
): CriterionSseMessage | undefined {
  switch (eventName) {
    case CriterionSseEventName.refreshRequired:
      return { eventName, payload: payload as ICriterionRefreshRequiredPayload };
    case CriterionSseEventName.criterionStatusChanged:
      return { eventName, payload: payload as ICriterion };
    case CriterionSseEventName.criterionCreated:
      return { eventName, payload: payload as ICriterion };
    case CriterionSseEventName.criterionPublished:
      return { eventName, payload: payload as ICriterionChangeEvent };
    case CriterionSseEventName.criterionSuspended:
      return { eventName, payload: payload as ICriterionChangeEvent };
    case CriterionSseEventName.criterionUpdated:
      return { eventName, payload: payload as ICriterion };
    default:
      return undefined;
  }
}

class CriterionSseListener implements ISseListener {
  private readonly envelope: TEnvelope;

  constructor(envelope: TEnvelope) {
    this.envelope = envelope;
  }

  handleEvent = (): void => {
    const msg = narrowCriterionSseMessage(this.envelope.eventName, this.envelope.payload);
    if (!msg) {
      console.log('[SSE] Unhandled criterion event:', this.envelope.eventName);
      return;
    }

    switch (msg.eventName) {
      case CriterionSseEventName.refreshRequired: {
        DataSync.refreshCriteriaData([msg.payload.criterionId]);
        break;
      }

      case CriterionSseEventName.criterionStatusChanged:
      case CriterionSseEventName.criterionCreated: {
        const { match } = msg.payload;
        if (match) DataSync.refreshMatchData(match.id);
        break;
      }

      case CriterionSseEventName.criterionPublished: {
        const criterion = msg.payload;
        DataSync.updateCriteria([
          {
            id: criterion.criterionId,
            status: criterion.status,
          },
        ]);
        break;
      }

      case CriterionSseEventName.criterionSuspended: {
        const criterion = msg.payload;
        DataSync.updateCriteria([
          {
            id: criterion.criterionId,
            status: criterion.status,
          },
        ]);
        break;
      }

      case CriterionSseEventName.criterionUpdated: {
        DataSync.updateCriteria([msg.payload]);
        break;
      }
    }
  };
}

export default CriterionSseListener;
