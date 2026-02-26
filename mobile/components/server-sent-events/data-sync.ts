import { IOddWithCriterion } from '@/services';
import {
  getAllCriteriaQueryOptions,
  getCriterionByIdQueryOptions,
} from '@/services/criteria/criterion-query';
import { getMatchQueryOptions, getMatchCriteriaQueryOptions } from '@/services/matches/match-query';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { getOddByIdQueryOptions, getAllOddsQueryOptions } from '@/services/odds/odd-query';
import { ICriterion, IMatch, IOdd } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { patch } from '@/utils/object';
import { queryClient } from '@/utils/react-query';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Entity with id required; all other fields remain partial */
type WithRequiredId<T> = DeepPartial<T> & { id: string };

class _DataSync {
  public updateMatches(matches: WithRequiredId<IMatch>[]) {
    let criteria: ICriterion[] = [];
    let odds: IOddWithCriterion[] = [];

    for (const match of matches) {
      if (!match.mainCriterion) continue;

      criteria.push(match.mainCriterion);

      if (match.mainCriterion) {
        const criterion = match.mainCriterion;
        odds.concat(
          match.mainCriterion.odds.map((odd) => ({
            ...odd,
            criterion,
          }))
        );
      }

      // 1. Update the match data
      const matchKey = getMatchQueryOptions({ matchId: match.id });
      queryClient.setQueryData(matchKey.queryKey, (value) => {
        return { ...value, data: patch(value?.data, match) } as IApiResponse<IMatch>;
      });
    }

    // 2. Update criteria data
    this.updateCriteria(criteria);

    // 4. Update odds data
    this.updateOdds(odds);
  }

  public updateCriteria(criteria: WithRequiredId<IMatchCriteriaResponse>[]) {
    let allOdds: WithRequiredId<IOdd>[] = [];

    for (const criterion of criteria) {
      // 1. Update single criterion query
      const criteriaKey = getAllCriteriaQueryOptions();
      queryClient.setQueryData(criteriaKey.queryKey, (lastCriteria) => {
        const data = (lastCriteria?.data ?? []).reduce((acc, value) => {
          if (value.id === criterion.id) {
            return [...acc, patch(value, criterion)];
          }

          if (criterion.odds) {
            const withId = criterion.odds.filter(
              (o): o is WithRequiredId<IOdd> => typeof o?.id === 'string'
            );
            allOdds = allOdds.concat(withId);
          }

          return [...acc, value];
        }, [] as ICriterion[]);

        return {
          ...lastCriteria,
          data,
        } as IApiResponse<ICriterion[]>;
      });

      // 2. Update Match Criterion Query
      if (criterion.match?.id) {
        const matchCriteriaKey = getMatchCriteriaQueryOptions({ matchId: criterion.match.id });
        queryClient.setQueryData(matchCriteriaKey.queryKey, (lastMatchCriteria) => {
          const data = (lastMatchCriteria?.data ?? []).reduce((acc, value) => {
            if (value.id === criterion.id) {
              return [...acc, patch(value, criterion)];
            }
            return [...acc, value];
          }, [] as IMatchCriteriaResponse[]);

          return {
            ...lastMatchCriteria,
            data,
          } as IApiResponse<IMatchCriteriaResponse[]>;
        });
      }

      // 3. Update Match Query
      if (criterion.match?.id) {
        const matchKey = getMatchQueryOptions({ matchId: criterion.match.id });
        queryClient.setQueryData(matchKey.queryKey, (lastMatch) => {
          if (lastMatch?.data?.mainCriterion?.id === criterion.id) {
            const patchedMainCriterion = patch(lastMatch?.data.mainCriterion, criterion);
            return {
              ...lastMatch,
              data: {
                ...lastMatch?.data,
                mainCriterion: patchedMainCriterion,
              },
            } as IApiResponse<IMatch>;
          }
          return lastMatch;
        });
      }
    }

    // 3. Update odds data
    this.updateOdds(allOdds);
  }

  /**
   * If you ever have issues with Odds outta sync when the data comes from Criterion,
   * it's because the sync here does not affect the Criterion.
   * Because, the odds will always look for the Odds store,
   * and Criterion will always sync the Criterion and the Odd store, and not the other way around.
   */
  public updateOdds(odds: WithRequiredId<IOdd>[]) {
    for (const odd of odds) {
      // 1. Update single odd query
      const oddKey = getOddByIdQueryOptions({ oddId: odd.id });
      queryClient.setQueryData(oddKey.queryKey, (lastOdd) => {
        let copy = {
          ...lastOdd,
          data: patch(lastOdd?.data, odd),
        } as IApiResponse<IOddWithCriterion>;
        return copy;
      });

      // 2. Update all odds query
      const oddsKey = getAllOddsQueryOptions();
      queryClient.setQueryData(oddsKey.queryKey, (lastOdds) => {
        const data = (lastOdds?.data ?? []).reduce((acc, value) => {
          if (value.id === odd.id) {
            return [...acc, patch(value, odd)];
          }
          return [...acc, value];
        }, [] as IOddWithCriterion[]);

        return {
          ...lastOdds,
          data,
        } as IApiResponse<IOddWithCriterion[]>;
      });
    }
  }

  public refreshOddsData(oddIds: string[]) {
    for (const oddId of oddIds) {
      const oddKey = getOddByIdQueryOptions({ oddId });
      queryClient.invalidateQueries({ queryKey: oddKey.queryKey });
    }
  }

  public refreshCriteriaData(criterionIds: string[], matchId?: string) {
    for (const criterionId of criterionIds) {
      const criterionKey = getCriterionByIdQueryOptions({ criterionId });
      queryClient.invalidateQueries({ queryKey: criterionKey.queryKey });

      matchId &&
        queryClient.invalidateQueries({
          queryKey: getMatchCriteriaQueryOptions({ matchId }).queryKey,
        });
    }
  }

  public refreshMatchData(matchId: string) {
    const matchKey = getMatchQueryOptions({ matchId });
    queryClient.invalidateQueries({ queryKey: matchKey.queryKey });

    const matchCriteriaKey = getMatchCriteriaQueryOptions({ matchId });
    queryClient.invalidateQueries({ queryKey: matchCriteriaKey.queryKey });
  }
}

export const DataSync = new _DataSync();
