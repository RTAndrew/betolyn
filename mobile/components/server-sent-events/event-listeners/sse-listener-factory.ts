import { MessageEvent } from 'react-native-sse';

import type { TSseDomain } from '../sse-events';

import { SseDomain } from '../sse-events';
import CriterionSseListener from './criterion-sse.listener';
import MatchSseListener from './match-sse.listener';
import OddSseListener from './odd-sse.listener';
import TeamSseListener from './team-sse.listener';
import { ISseListener } from './types';
import UserSseListener from './user-sse.listener';

export interface ISseEvent<TPayload extends object = object> {
  payload: TPayload;
  domain: TSseDomain;
  eventName: string;
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
      case SseDomain.odd:
        return new OddSseListener(payload);
      case SseDomain.match:
        return new MatchSseListener(payload);
      case SseDomain.team:
        return new TeamSseListener(payload);
      case SseDomain.user:
        return new UserSseListener(payload);
      case SseDomain.criterion:
        return new CriterionSseListener(payload);
      default:
        return new DefaultSseListener(`[SSE] Invalid domain: ${payload.domain}`);
    }
  }
}

export default SseListenerFactory;
