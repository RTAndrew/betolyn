import { patch } from '@/utils/object';
import { computed, signal } from '@preact/signals-react';

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

const editOddSlip = (matchId: string, data: Partial<IBet>) => {
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
  if (data.oddId) notifyListenersForOddId(data.oddId);
};

/**
 * Add a bet to the slip. If the bet already exists, it will be removed.
 * @param matchId - The ID of the match to add the bet to
 * @param bet - The bet to add to the slip
 * @returns void
 */
const addBetToSlip = (matchId: string, bet: IBet) => {
  const matchBets = slip.value[matchId];

  const existingBet = matchBets?.find((b) => b.oddId === bet.oddId);
  if (existingBet) {
    // If the bet is the only bet in the match, delete the match completely
    if (matchBets.length === 1) {
      const copy = { ...slip.value };
      delete copy[matchId];
      slip.value = copy;
    } else {
      slip.value = {
        ...slip.value,
        [matchId]: matchBets.filter((b) => b.oddId !== bet.oddId),
      };
    }
    notifyListenersForOddId(bet.oddId);
    return;
  }

  slip.value = {
    ...slip.value,
    [matchId]: [...(matchBets || []), bet],
  };
  notifyListenersForOddId(bet.oddId);
};

const betType = signal<'single' | 'parlay'>('single');
const updateBetType = (type: 'single' | 'parlay') => {
  betType.value = type;
};
const slip = signal<TBetSlip>({});

/** Per-oddId listeners for useSyncExternalStore;
 * only notified when that odd is added/removed/edited.
 */
const oddIdListeners = new Map<string, Set<() => void>>();

const notifyListenersForOddId = (oddId: string) => {
  oddIdListeners.get(oddId)?.forEach((cb) => cb());
};

const subscribeToOddId = (oddId: string, onStoreChange: () => void): (() => void) => {
  // 1. Check if the oddId is already in the map, otherwise create a new set
  if (!oddIdListeners.has(oddId)) oddIdListeners.set(oddId, new Set());

  // 2. Add the listener to the set
  oddIdListeners.get(oddId)?.add(onStoreChange);

  // 3. Return a function to unsubscribe the listener
  return () => {
    oddIdListeners.get(oddId)?.delete(onStoreChange);
  };
};

const totalPotentialPayout = computed(() => {
  return Object.keys(slip.value).reduce((acc, matchId) => {
    const bets = slip.value[matchId];
    return acc + bets.reduce((acc, bet) => acc + bet.stake * bet.oddAtPlacement, 0);
  }, 0);
});

const totalBets = computed(() => Object.keys(slip.value).length);

const totatStake = computed(() =>
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

export const betSlipStore = {
  addBetToSlip,
  editOddSlip,
  totalBets,
  bets: slip,
  totalPotentialPayout,
  totatStake,
  betType,
  updateBetType,
  getBetByOddId,
  subscribeToOddId,
} as const;
