import { EBetSlipType, IBetSlip } from '@/types';
import { postRequest } from '@/utils/http';

export interface IPlaceBetItem {
  oddId: string;
  stake: number;
  oddValueAtPlacement: number;
}

export interface IPlaceBetRequest {
  type: `${EBetSlipType}`;
  items: IPlaceBetItem[];
}

export class SlipService {
  public static async placeBet(data: IPlaceBetRequest) {
    return await postRequest<IBetSlip, IPlaceBetRequest>('/bets', data);
  }
}
