import { IBetSlip, IUserPublic } from '@/types';
import { getRequest } from '@/utils/http';

export interface IMe {
  token: string;
  user: IUserPublic;
  sessionId: string;
  balance?: {
    available: number;
    reserved: number;
  };
}

export class MeService {
  public static async getMe() {
    return await getRequest<IMe>('/me');
  }

  public static async getMyBets() {
    return await getRequest<IBetSlip[]>('/me/bets');
  }

  public static async getBetSlipItemById(betSlipItemId: string) {
    return await getRequest<IBetSlip['items'][number]>(`/me/bets/items/${betSlipItemId}`);
  }
}
