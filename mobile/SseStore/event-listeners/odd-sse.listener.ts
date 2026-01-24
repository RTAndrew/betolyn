import { ISseEvent } from '.';
import { ISseListener } from './types';
import { SseStoreOrchestrator } from '../stores/index';
import { IOdd } from '@/types';
import { getSseQueryClient } from '../utils';
import { OddSseStore } from '../stores/OddSse.store';

type TPayload = ISseEvent<any>;

interface IOddChangeEvent {
  oddId: string;
  value?: number;
  status?: IOdd['status'];
  direction?: 'UP' | 'DOWN';
}

class OddSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    switch (eventName) {
      case 'oddValueChanged':
      case 'oddStatusChanged': {
        console.log('[SSE] Odd status changed:', eventPayload);
        const odd = eventPayload as IOddChangeEvent;

        OddSseStore.setOdds([{
          id: odd.oddId,
          direction: odd.direction,
          status: odd?.status,
          value: odd?.value,
        }]);
        break;
      }

      case 'oddCreated': {
        // SseStoreOrchestrator.setOdds([odd]);
        break;
      }

      default:
        console.log('[SSE] Unhandled odd event:', eventName);
    }
  };
}

export default OddSseListener;
