import { MatchStatusEnum, type IMatch } from '@/types';

import type { ISseEvent } from './sse-listener-factory';

import { DataSync } from '../data-sync';
import { MatchSseEventName } from '../sse-events';
import { ISseListener } from './types';

type TEnvelope = ISseEvent<object>;

interface IMatchEventPayload {
  match?: IMatch;
  matchId?: string;
  settledAt?: string;
}

type MatchSseMessage =
  | { eventName: typeof MatchSseEventName.matchProgressChanged; payload: IMatchEventPayload }
  | { eventName: typeof MatchSseEventName.matchCreated; payload: IMatchEventPayload }
  | { eventName: typeof MatchSseEventName.matchVoided; payload: IMatchEventPayload }
  | { eventName: typeof MatchSseEventName.scoreChanged; payload: IMatchEventPayload }
  | { eventName: typeof MatchSseEventName.rescheduled; payload: IMatchEventPayload }
  | { eventName: typeof MatchSseEventName.matchSettled; payload: IMatchEventPayload };

function narrowMatchSseMessage(eventName: string, payload: unknown): MatchSseMessage | undefined {
  const p = payload as IMatchEventPayload;
  switch (eventName) {
    case MatchSseEventName.matchProgressChanged:
      return { eventName: MatchSseEventName.matchProgressChanged, payload: p };
    case MatchSseEventName.matchCreated:
      return { eventName: MatchSseEventName.matchCreated, payload: p };
    case MatchSseEventName.matchVoided:
      return { eventName: MatchSseEventName.matchVoided, payload: p };
    case MatchSseEventName.scoreChanged:
      return { eventName: MatchSseEventName.scoreChanged, payload: p };
    case MatchSseEventName.rescheduled:
      return { eventName: MatchSseEventName.rescheduled, payload: p };
    case MatchSseEventName.matchSettled:
      return { eventName: MatchSseEventName.matchSettled, payload: p };
    default:
      return undefined;
  }
}

class MatchSseListener implements ISseListener {
  private readonly envelope: TEnvelope;

  constructor(envelope: TEnvelope) {
    this.envelope = envelope;
  }

  handleEvent = (): void => {
    const msg = narrowMatchSseMessage(this.envelope.eventName, this.envelope.payload);
    if (!msg) {
      console.log('[SSE] Unhandled match event:', this.envelope.eventName);
      return;
    }

    switch (msg.eventName) {
      case MatchSseEventName.matchVoided:
        if (msg.payload?.matchId) {
          DataSync.updateMatches([{ id: msg.payload.matchId, status: MatchStatusEnum.CANCELLED }]);
        }
        break;
      case MatchSseEventName.matchProgressChanged:
      case MatchSseEventName.matchCreated:
        if (msg.payload?.match) {
          DataSync.updateMatches([msg.payload.match]);
        }
        break;

      case MatchSseEventName.matchSettled: {
        const { matchId, settledAt } = msg.payload;
        if (matchId && settledAt) {
          DataSync.updateMatches([{ id: matchId, settledAt }]);
        }
        break;
      }

      case MatchSseEventName.scoreChanged:
      case MatchSseEventName.rescheduled:
        console.log('[SSE] Match event - store update not yet implemented for', msg.eventName);
        break;
    }
  };
}

export default MatchSseListener;
