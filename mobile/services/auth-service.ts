import { getRequest, postRequest } from '@/utils/http';
import {
  IAuthSession,
  SignInRequestDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
} from '../app/auth/signup/types';

export class AuthService {
  public static async signIn(requestDTO: SignInRequestDTO) {
    return await postRequest<IAuthSession, SignInRequestDTO>('/auth/signin', requestDTO);
  }

  public static async signUp(requestDTO: SignUpRequestDTO) {
    return await postRequest<SignUpResponseDTO, SignUpRequestDTO>('/auth/signup', requestDTO);
  }

  public static async signOut() {
    return await getRequest<void>(`/auth/logout`);
  }
}
