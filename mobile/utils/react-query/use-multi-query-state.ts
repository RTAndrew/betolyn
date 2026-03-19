import type { UseQueryResult } from '@tanstack/react-query';

type AnyQueryResult = UseQueryResult<unknown, unknown>;

export type MultiQueryStateItem = {
  query: AnyQueryResult;
  /**
   * When false, the query will not participate in "blocking" loading/error derivation.
   * Useful for queries that are conditionally enabled.
   */
  requiredWhen?: boolean;
};

export type MultiQueryState = {
  /**
   * True when any query marked required is still in a pending/loading state.
   * This is intended for skeleton/blocked UI states.
   */
  isInitialLoading: boolean;
  /**
   * True when any query is currently fetching/refetching (background refresh).
   */
  isFetchingAny: boolean;
  isErrorAny: boolean;
  errors: unknown[];
  /**
   * True when every requiredWhen=true query has succeeded.
   */
  allRequiredReady: boolean;
};

/**
 * Derives a multi-query state from a list of query results
 * @example
 * ```tsx
 * const betsQuery = useQuery({ queryKey: ['bets'], queryFn: () => getBets() });
 * const metricsQuery = useQuery({ queryKey: ['metrics'], queryFn: () => getMetrics() });
 * const { isInitialLoading, isFetchingAny, isErrorAny, errors, allRequiredReady } = useMultiQueryState([
 *    { query: betsQuery },
 *    { query: metricsQuery },
 *  ]);
 *
 * if (isInitialLoading) return <ThemedText>Loading...</ThemedText>;
 * if (isErrorAny) return <ThemedText>Error loading bets or metrics</ThemedText>;
 * if (allRequiredReady) return <ThemedText>Bets and metrics loaded</ThemedText>;
 * ```
 */
export function useMultiQueryState(items: MultiQueryStateItem[]): MultiQueryState {
  // Note: this is a pure state-derivation helper; it assumes each `query` comes from `useQuery`.
  const requiredItems = items.filter((i) => (i.requiredWhen ?? true) === true);

  const isErrorAny = requiredItems.some((i) => Boolean(i.query?.isError));
  const isInitialLoading = requiredItems.some((i) => Boolean(i.query?.isPending));
  const isFetchingAny = requiredItems.some((i) => Boolean(i.query?.isFetching)) === true;

  const errors = requiredItems
    .filter((i) => Boolean(i.query?.isError))
    .map((i) => i.query.error)
    .filter(Boolean);

  const allRequiredReady =
    requiredItems.length > 0 &&
    requiredItems.every((i) => i.query?.status === 'success' && i.query?.data !== undefined);

  return {
    isInitialLoading,
    isFetchingAny,
    isErrorAny,
    errors,
    allRequiredReady,
  };
}
