import { MessageEvent } from 'react-native-sse';
import OddSseListener from './odd-sse.listener';
import MatchSseListener from './match-sse.listener';
import TeamSseListener from './team-sse.listener';
import UserSseListener from './user-sse.listener';
import CriterionSseListener from './criterion-sse.listener';
import { ISseListener } from './types';

export interface ISseEvent<T extends object> {
  payload: T;
  domain: 'odd' | 'match' | 'team' | 'user' | 'criterion';
  eventName: 'REFRESH_REQUIRED' | string;
  timestamp: number;
}

class DefaultSseListener extends ISseListener {
  private readonly message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
  handleEvent = (): void => {
    console.log(`[SSE] ${this.message}`);
  };
}

const parsePayload = (event: string) => {
  try {
    return JSON.parse(event) as ISseEvent<any>;
  } catch {
    return null;
  }
};

class SseListenerFactory {
  public static createListener(event: MessageEvent): ISseListener {
    const payload = parsePayload(event?.data ?? '');

    if (!payload) {
      return new DefaultSseListener('[SSE] Error parsing payload');
    }

    switch (payload.domain) {
      case 'odd':
        return new OddSseListener(payload);
      case 'match':
        return new MatchSseListener(payload);
      case 'team':
        return new TeamSseListener(payload);
      case 'user':
        return new UserSseListener(payload);
      case 'criterion':
        return new CriterionSseListener(payload);
      default:
        return new DefaultSseListener(`[SSE] Invalid domain: ${payload.domain}`);
    }
  }
}

export default SseListenerFactory;
