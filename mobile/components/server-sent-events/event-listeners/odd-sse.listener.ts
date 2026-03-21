import type { IOdd } from '@/types';

import type { ISseEvent } from './sse-listener-factory';

import { DataSync } from '../data-sync';
import { OddSseEventName } from '../sse-events';
import { ISseListener } from './types';

type TEnvelope = ISseEvent<object>;

interface IOddStatusChangeEvent {
  odds: string[];
  status?: IOdd['status'];
}

interface IOddCreatedEvent {
  oddId: string;
  criterionId: string;
  matchId: string;
  status: IOdd['status'];
}

interface IOddValueChangeEvent {
  oddId: string;
  value?: number;
  direction?: 'UP' | 'DOWN';
}

type OddSseMessage =
  | { eventName: typeof OddSseEventName.oddStatusChanged; payload: IOddStatusChangeEvent }
  | { eventName: typeof OddSseEventName.oddValueChanged; payload: IOddValueChangeEvent }
  | { eventName: typeof OddSseEventName.oddCreated; payload: IOddCreatedEvent }
  | { eventName: typeof OddSseEventName.oddUpdated; payload: IOdd };

function narrowOddSseMessage(eventName: string, payload: unknown): OddSseMessage | undefined {
  switch (eventName) {
    case OddSseEventName.oddStatusChanged:
      return { eventName, payload: payload as IOddStatusChangeEvent };
    case OddSseEventName.oddValueChanged:
      return { eventName, payload: payload as IOddValueChangeEvent };
    case OddSseEventName.oddCreated:
      return { eventName, payload: payload as IOddCreatedEvent };
    case OddSseEventName.oddUpdated:
      return { eventName, payload: payload as IOdd };
    default:
      return undefined;
  }
}

/**
 * If you ever have issues with Odd outta of when the data comes from Criterion,
 * it's because the sync here does not affect the Criterion.
 * Because, the odds will always look for the Odds store,
 * and Criterion will always sync the Odd store, and not the other way around.
 */
class OddSseListener implements ISseListener {
  private readonly envelope: TEnvelope;

  constructor(envelope: TEnvelope) {
    this.envelope = envelope;
  }

  handleEvent = (): void => {
    const msg = narrowOddSseMessage(this.envelope.eventName, this.envelope.payload);
    if (!msg) {
      console.log('[SSE] Unhandled odd event:', this.envelope.eventName);
      return;
    }

    switch (msg.eventName) {
      case OddSseEventName.oddStatusChanged: {
        const { odds, status } = msg.payload;
        DataSync.updateOdds(odds.map((id) => ({ id, status })));
        break;
      }

      case OddSseEventName.oddValueChanged: {
        const { oddId, value, direction } = msg.payload;
        DataSync.updateOdds([{ id: oddId, value, direction }]);
        break;
      }

      case OddSseEventName.oddCreated: {
        const { criterionId, matchId } = msg.payload;
        DataSync.refreshCriteriaData([criterionId], matchId);
        break;
      }

      case OddSseEventName.oddUpdated: {
        DataSync.updateOdds([msg.payload]);
        break;
      }
    }
  };
}

export default OddSseListener;
