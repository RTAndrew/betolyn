import { DataSync } from '../data-sync';
import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';
import { IOdd } from '@/types';

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

        DataSync.updateOdds([
          {
            id: odd.oddId,
            direction: odd.direction,
            status: odd?.status,
            value: odd?.value,
          },
        ]);
        break;
      }

      case 'oddCreated': {
        const odd = eventPayload as IOdd;

        DataSync.updateOdds([odd]);
        break;
      }

      default:
        console.log('[SSE] Unhandled odd event:', eventName);
    }
  };
}

export default OddSseListener;
