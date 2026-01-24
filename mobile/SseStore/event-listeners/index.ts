import { MessageEvent } from "react-native-sse";
import OddSseListener from "./odd-sse.listener";
import MatchSseListener from "./match-sse.listener";
import TeamSseListener from "./team-sse.listener";
import UserSseListener from "./user-sse.listener";
import CriterionSseListener from "./criterion-sse.listener";
import { ISseListener } from "./types";

export interface ISseEvent<T extends object> {
  payload: T;
  domain: "odd" | "match" | "team" | "user" | "criterion";
  eventName: string;
  timestamp: number;
}

class ListenerFactory {
  public static createListener(event: MessageEvent): ISseListener {
    const payload = JSON.parse(event?.data ?? '') as ISseEvent<any>;

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
        throw new Error(`Invalid domain: ${payload.domain}`); // TODO: just console.log
    }
  }
}

export default ListenerFactory;