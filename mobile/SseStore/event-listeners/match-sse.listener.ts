import { ISseEvent } from ".";
import { ISseListener } from "./types";
import { SseStoreOrchestrator } from "../stores/index";
import { IMatch } from "@/types";
import { getSseQueryClient } from "../utils";

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
          SseStoreOrchestrator.updateMatch(match);
          
          // Update React Query cache
          const client = getSseQueryClient();
          client.setQueryData(['match-sse', match.id], match);
          const matchesCache = client.getQueryData<Record<string, IMatch>>(['matches-sse']);
          if (matchesCache) {
            client.setQueryData(['matches-sse'], {
              ...matchesCache,
              [match.id]: match,
            });
          }
        } else if (eventPayload?.matchId) {
          // If only matchId is provided, invalidate queries to trigger refetch
          const client = getSseQueryClient();
          client.invalidateQueries({ queryKey: ['match-sse', eventPayload.matchId] });
          client.invalidateQueries({ queryKey: ['matches-sse'] });
        }
        break;

      default:
        console.log('[SSE] Unhandled match event:', eventName);
    }
  };
}

export default MatchSseListener;
