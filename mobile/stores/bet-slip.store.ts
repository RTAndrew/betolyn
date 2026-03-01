import { computed, signal } from '@preact/signals-react';

import { patch } from '@/utils/object';

type TBetSlip = Record<string, IBet[]>;

export interface IBet {
  oddId: string;
  stake: number;
  criterionId: string;
  oddAtPlacement: number;
}

export interface IBetSlipStore {
  bets: TBetSlip;
}

const editOddSlip = (matchId: string, data: Partial<IBet> & { oddId: string }) => {
  slip.value = {
    ...slip.value,
    [matchId]: slip.value[matchId].flatMap((bet) => {
      if (bet.oddId === data.oddId) {
        return [
          {
            ...bet,
            ...patch(bet, data),
          },
        ];
      }
      return bet;
    }),
  };
  notifyListenersForOddId(data.oddId);
};

const removeOddSlip = (matchId: string, oddId: string) => {
  const matchBets = slip.value?.[matchId] ?? [];

  if (matchBets.length === 1) {
    const copy = { ...slip.value };
    delete copy[matchId];
    slip.value = copy;
  } else {
    slip.value = {
      ...slip.value,
      [matchId]: matchBets.filter((b) => b.oddId !== oddId),
    };
  }
  notifyListenersForOddId(oddId);
};

/**
 * Add a bet to the slip. If the bet already exists, it will be removed.
 * @param matchId - The ID of the match to add the bet to
 * @param bet - The bet to add to the slip
 * @returns void
 */
const addBetToSlip = (matchId: string, bet: IBet) => {
  const matchBets = slip.value?.[matchId] ?? [];

  const betExists = matchBets?.find((b) => b.oddId === bet.oddId);
  if (betExists) {
    removeOddSlip(matchId, bet.oddId);
    return;
  }

  slip.value = {
    ...slip.value,
    [matchId]: [...matchBets, bet],
  };
  notifyListenersForOddId(bet.oddId);
};

const betType = signal<'single' | 'parlay'>('single');
const parlayStake = signal(0);
const setParlayStake = (value: number) => {
  parlayStake.value = value;
};
const slip = signal<TBetSlip>({});

const updateBetType = (type: 'single' | 'parlay') => {
  betType.value = type;
};

/** Per-oddId listeners for useSyncExternalStore;
 * only notified when that odd is added/removed/edited.
 */
const oddIdListeners = new Map<string, Set<() => void>>();

const notifyListenersForOddId = (oddId?: string) => {
  if (oddId) {
    oddIdListeners.get(oddId)?.forEach((cb) => cb());
    return;
  }

  for (const [, set] of oddIdListeners.entries()) {
    set.forEach((cb) => cb());
  }
};

const subscribeToOddId = (oddId: string, onStateChange: () => void): (() => void) => {
  // 1. Check if the oddId is already in the map, otherwise create a new set
  if (!oddIdListeners.has(oddId)) oddIdListeners.set(oddId, new Set());

  // 2. Add the listener to the set
  oddIdListeners.get(oddId)?.add(onStateChange);

  // 3. Return a function to unsubscribe the listener
  return () => {
    oddIdListeners.get(oddId)?.delete(onStateChange);
  };
};

const totalPotentialPayout = computed(() => {
  const allBets = Object.values(slip.value).flat();

  if (betType.value === 'parlay') {
    if (allBets.length === 0) return 0;
    const productOfOdds = allBets.reduce((acc, bet) => acc * bet.oddAtPlacement, 1);
    return parlayStake.value * productOfOdds;
  }

  return allBets.reduce((acc, bet) => acc + bet.stake * bet.oddAtPlacement, 0);
});

const totalBets = computed(() => Object.keys(slip.value).length);

const totalStake = computed(() =>
  Object.keys(slip.value).reduce((acc, matchId) => {
    const bets = slip.value[matchId];
    return acc + bets.reduce((acc, bet) => acc + bet.stake, 0);
  }, 0)
);

const getBetByOddId = (oddId: string) => {
  return Object.values(slip.value)
    .flatMap((bet) => bet)
    .find((bet) => bet.oddId === oddId);
};

const clearSlip = () => {
  slip.value = {};
  parlayStake.value = 0;
  notifyListenersForOddId();
};

export const betSlipStore = {
  addBetToSlip,
  editOddSlip,
  removeOddSlip,
  totalBets,
  bets: slip,
  totalPotentialPayout,
  totalStake,
  betType,
  updateBetType,
  parlayStake,
  setParlayStake,
  getBetByOddId,
  subscribeToOddId,
  clearSlip,
} as const;
