import { ISseEvent } from ".";
import { ISseListener } from "./types";
import { SseStoreOrchestrator } from "../stores/index";
import { ICriterion } from "@/types";

type TPayload = ISseEvent<any>;

class CriterionSseListener implements ISseListener {
  private readonly payload: TPayload;

  constructor(payload: TPayload) {
    this.payload = payload;
  }

  handleEvent = () => {
    const { eventName, payload: eventPayload } = this.payload;

    console.log('[SSE] Criterion event received:', eventName, eventPayload);

    // Handle different criterion event types
    switch (eventName) {
      case 'criterionStatusChanged':
      case 'criterionCreated':
      case 'criterionPublished':
        if (eventPayload) {
          const criterion = eventPayload as ICriterion;
          SseStoreOrchestrator.setCriteria([criterion]);
        }
        break;

      case 'criterionUpdated':
        // Handle dynamic criterion update events (criterionUpdated:{criterionId})
        if (eventPayload) {
          const criterion = eventPayload as ICriterion;
          SseStoreOrchestrator.setCriteria([criterion]);
        }
        break;

      default:
        console.log('[SSE] Unhandled criterion event:', eventName);
    }
  };
}

export default CriterionSseListener;
