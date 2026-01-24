import { ICriterion, IMatch, IOdd } from "@/types";
import { MatchesSseStore } from './MatchesSse.store';
import { CriteriaSseStore } from './CriteriaSse.store';
import { OddSseStore } from './OddSse.store';
import { IMatchCriteriaResponse } from '@/services';

class _SseStore {
  public setMatches(matches: IMatch[]) {
    MatchesSseStore.setMatches(matches);

    let criteria: ICriterion[] = [];
    let odds: IOdd[] = [];
    for (const match of matches) {
      if (!match.mainCriterion) continue;

      criteria.push(match.mainCriterion);
      odds.push(...match.mainCriterion.odds);
    }

    CriteriaSseStore.setCriterias(criteria);
    OddSseStore.setOdds(odds);
  }

  public updateMatch(match: IMatch) {
    this.setMatches([match]);
  }

  public setCriteria(criteria: ICriterion[]) {
    CriteriaSseStore.setCriterias(criteria);
  }

  public setMatchWithCriteria(matchWithCriteria: IMatchCriteriaResponse[]) {
    for (const criterion of matchWithCriteria) {
      this.setCriteria([criterion]);
      this.setOdds(criterion.odds);
    }
  }

  public setOdds(odds: IOdd[]) {
    OddSseStore.setOdds(odds);
  }
}

export const SseStoreOrchestrator = new _SseStore();