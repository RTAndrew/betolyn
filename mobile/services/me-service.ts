import { getRequest } from '@/utils/http';
import { IBetSlip } from '@/types';
import { SignInResponseDTO } from '../app/auth/signup/types';

export class MeService {
  public static async getMe() {
    return await getRequest<SignInResponseDTO>('/me');
  }

  public static async getMyBets() {
    return await getRequest<IBetSlip[]>('/me/bets');
  }
}
