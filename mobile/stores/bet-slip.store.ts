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

const addBetToSlip = (matchId: string, bet: IBet) => {
  const existingBet = _betSlipStore.value[matchId]?.find((b) => b.oddId === bet.oddId);
  if (existingBet) {
    return;
  }

  _betSlipStore.value = {
    ..._betSlipStore.value,
    [matchId]: [...(_betSlipStore.value[matchId] || []), bet],
  };
};

const editOddSlip = (matchId: string, data: Partial<IBet>) => {
  _betSlipStore.value = {
    ..._betSlipStore.value,
    [matchId]: _betSlipStore.value[matchId].flatMap((bet) => {
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
};

const betType = signal<'single' | 'parlay'>('single');
const updateBetType = (type: 'single' | 'parlay') => {
  betType.value = type;
};
const _betSlipStore = signal<TBetSlip>({});

const totalPotentialPayout = computed(() => {
  return Object.keys(_betSlipStore.value).reduce((acc, matchId) => {
    const bets = _betSlipStore.value[matchId];
    return acc + bets.reduce((acc, bet) => acc + bet.stake * bet.oddAtPlacement, 0);
  }, 0);
});

const totalBets = computed(() => Object.keys(_betSlipStore.value).length);

const totatStake = computed(() =>
  Object.keys(_betSlipStore.value).reduce((acc, matchId) => {
    const bets = _betSlipStore.value[matchId];
    return acc + bets.reduce((acc, bet) => acc + bet.stake, 0);
  }, 0)
);
export const betSlipStore = {
  addBetToSlip,
  editOddSlip,
  totalBets,
  bets: _betSlipStore,
  totalPotentialPayout,
  totatStake,
  betType,
  updateBetType,
} as const;
