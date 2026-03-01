import { ICriterion } from '@/types';

import { DataSync } from '../data-sync';
import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';

type TPayload = ISseEvent<ICriterionChangeEvent>;
interface ICriterionChangeEvent {
  criterionId: string;
  matchId?: string;
  status?: ICriterion['status'];
}

class CriterionSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    switch (eventName) {
      case 'REFRESH_REQUIRED': {
        const odd = eventPayload as any;
        DataSync.refreshCriteriaData(odd.criterionId);
        break;
      }

      case 'criterionStatusChanged':
      case 'criterionCreated': {
        const { match } = eventPayload as unknown as ICriterion;
        if (match) DataSync.refreshMatchData(match.id);
        break;
      }

      case 'criterionPublished': {
        const criterion = eventPayload as unknown as ICriterionChangeEvent;
        DataSync.updateCriteria([
          {
            id: criterion.criterionId,
            status: criterion.status,
          },
        ]);
        break;
      }

      case 'criterionSuspended': {
        const criterion = eventPayload as unknown as ICriterionChangeEvent;
        DataSync.updateCriteria([
          {
            id: criterion.criterionId,
            status: criterion.status,
          },
        ]);
        break;
      }

      case 'criterionUpdated': {
        const criterion = eventPayload as unknown as ICriterion;
        DataSync.updateCriteria([criterion]);
        break;
      }

      default:
        console.log('[SSE] Unhandled criterion event:', eventName);
    }
  };
}

export default CriterionSseListener;
