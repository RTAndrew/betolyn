import { DataSync } from '../data-sync';
import { ISseEvent } from './sse-listener-factory';
import { ISseListener } from './types';
import { IMatch } from '@/types';

type TPayload = ISseEvent<any>;

class MatchSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    console.log('[SSE] Match event received:', eventName, eventPayload);

    // Handle different match event types
    switch (eventName) {
      case 'matchProgressChanged':
      case 'matchCreated':
      case 'matchVoided':
        // If payload contains match data, update it
        if (eventPayload?.match) {
          const match = eventPayload.match as IMatch;
          DataSync.updateMatches([match]);
        }

        break;

      default:
        console.log('[SSE] Unhandled match event:', eventName);
    }
  };
}

export default MatchSseListener;
