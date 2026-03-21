import type { ISseEvent } from './sse-listener-factory';

import { UserSseEventName } from '../sse-events';
import { ISseListener } from './types';

type TEnvelope = ISseEvent<object>;

class UserSseListener implements ISseListener {
  private readonly envelope: TEnvelope;

  constructor(envelope: TEnvelope) {
    this.envelope = envelope;
  }

  handleEvent = (): void => {
    const { eventName, payload: eventPayload } = this.envelope;

    console.log('[SSE] User event received:', eventName, eventPayload);

    switch (eventName) {
      case UserSseEventName.userCreated:
      case UserSseEventName.userUpdated:
        // TODO: Implement user store updates when user store is created
        console.log('[SSE] User event - store update not yet implemented');
        break;

      default:
        console.log('[SSE] Unhandled user event:', eventName);
    }
  };
}

export default UserSseListener;
