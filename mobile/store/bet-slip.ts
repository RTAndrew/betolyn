import { signal } from "@preact/signals-react";

type TBetSlip = Record<string, IBet[]>;

export interface IBet {
  oddId: string;
  amount: number;
  criterionId: string;
  oddAtPlacement: number;
}

export interface IBetSlipStore {
  bets: TBetSlip;
}

export const addBetToSlip = (matchId: string, bet: IBet) => {

  const existingBet = betSlipStore.value[matchId]?.find((b) => b.oddId === bet.oddId);
  if (existingBet) {
    return;
  }

  betSlipStore.value = {
    ...betSlipStore.value,
    [matchId]: [...(betSlipStore.value[matchId] || []), bet],
  }
}

export const editOddSlipStake = (data: { matchId: string, oddId: string, stake: number }) => {
  betSlipStore.value = {
    ...betSlipStore.value,
    [data.matchId]: betSlipStore.value[data.matchId].flatMap
      ((bet) => {
        if(bet.oddId === data.oddId) {
          return [{
            ...bet,
            amount: data.stake,
          }];
        }
        return bet;
      }),
  }
}

export const betSlipStore = signal<TBetSlip>({});