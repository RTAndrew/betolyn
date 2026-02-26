import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';

type TPayload = ISseEvent<any>;

class TeamSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    console.log('[SSE] Team event received:', eventName, eventPayload);

    // Handle different team event types
    switch (eventName) {
      case 'teamCreated':
      case 'teamUpdated':
        // TODO: Implement team store updates when team store is created
        console.log('[SSE] Team event - store update not yet implemented');
        break;

      default:
        console.log('[SSE] Unhandled team event:', eventName);
    }
  };
}

export default TeamSseListener;
