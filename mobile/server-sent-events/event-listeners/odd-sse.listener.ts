import { DataSync } from '../data-sync';
import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';
import { IOdd } from '@/types';

type TPayload = ISseEvent<any>;

interface IOddStatusChangeEvent {
  odds: string[];
  status?: IOdd['status'];
}

interface IOddValueChangeEvent {
  oddId: string;
  value?: number;
  direction?: 'UP' | 'DOWN';
}

/**
 * If you ever have issues with Odd outta of when the data comes from Criterion,
 * it's because the sync here does not affect the Criterion.
 * Because, the odds will always look for the Odds store,
 * and Criterion will always sync the Odd store, and not the other way around.
 */
class OddSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    switch (eventName) {
      case 'oddStatusChanged': {
        const { odds, status } = eventPayload as IOddStatusChangeEvent;
        DataSync.updateOdds(odds.map((id) => ({ id, status })));
        break;
      }

      case 'oddValueChanged': {
        const { oddId, value, direction } = eventPayload as IOddValueChangeEvent;
        DataSync.updateOdds([{ id: oddId, value, direction }]);
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
