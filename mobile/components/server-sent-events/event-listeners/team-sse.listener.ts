import type { ISseEvent } from './sse-listener-factory';

import { TeamSseEventName } from '../sse-events';
import { ISseListener } from './types';

type TEnvelope = ISseEvent<object>;

class TeamSseListener implements ISseListener {
  private readonly envelope: TEnvelope;

  constructor(envelope: TEnvelope) {
    this.envelope = envelope;
  }

  handleEvent = (): void => {
    const { eventName, payload: eventPayload } = this.envelope;

    console.log('[SSE] Team event received:', eventName, eventPayload);

    switch (eventName) {
      case TeamSseEventName.teamCreated:
      case TeamSseEventName.teamUpdated:
        // TODO: Implement team store updates when team store is created
        console.log('[SSE] Team event - store update not yet implemented');
        break;

      default:
        console.log('[SSE] Unhandled team event:', eventName);
    }
  };
}

export default TeamSseListener;
