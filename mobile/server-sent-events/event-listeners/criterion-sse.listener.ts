import { DataSync } from '../data-sync';
import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';
import { ICriterion } from '@/types';

type TPayload = ISseEvent<ICriterionChangeEvent>;
interface ICriterionChangeEvent {
  criterionId: string;
  status?: ICriterion['status'];
}

class CriterionSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    console.log('[SSE] Criterion event received:', eventName, eventPayload);

    // Handle different criterion event types
    switch (eventName) {
      case 'REFRESH_REQUIRED': {
        const odd = eventPayload as any;
        DataSync.refreshCriteriaData(odd.criterionId);
        break;
      }

      case 'criterionStatusChanged':
      case 'criterionCreated':
      case 'criterionPublished':
        if (eventPayload) {
          const criterion = eventPayload;
          // DataSync.updateCriteria([criterion]);
        }
        break;

      case 'criterionUpdated':
        const criterion = eventPayload as unknown as ISseEvent<ICriterion>;
        // DataSync.updateCriteria([criterion]);

        break;

      default:
        console.log('[SSE] Unhandled criterion event:', eventName);
    }
  };
}

export default CriterionSseListener;
