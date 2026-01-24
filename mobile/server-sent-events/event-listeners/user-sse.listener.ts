import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';

type TPayload = ISseEvent<any>;

class UserSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    console.log('[SSE] User event received:', eventName, eventPayload);

    // Handle different user event types
    switch (eventName) {
      case 'userCreated':
      case 'userUpdated':
        // TODO: Implement user store updates when user store is created
        console.log('[SSE] User event - store update not yet implemented');
        break;

      default:
        console.log('[SSE] Unhandled user event:', eventName);
    }
  };
}

export default UserSseListener;
