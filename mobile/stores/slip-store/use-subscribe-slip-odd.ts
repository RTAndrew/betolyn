import { useCallback, useSyncExternalStore } from 'react';
import { betSlipStore } from '../bet-slip.store';

/**
 * Subscribe to the slip store for a given odd id whenever it is
 * added, removed, or edited.
 * @param oddId - The id of the odd to subscribe to.
 * @returns - The odd if it is in the slip store, otherwise undefined.
 */
export const useSubscribeSlipOdd = (oddId: string) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => betSlipStore.subscribeToOddId(oddId, onStoreChange),
    [oddId]
  );
  const getSnapshot = useCallback(() => betSlipStore.getBetByOddId(oddId), [oddId]);
  const odd = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return odd;
};
