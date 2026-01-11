import { IUser } from '@/types';

export interface SignUpRequestDTO {
  email: string;
  password: string;
  username: string;
}

export interface SignInRequestDTO {
  email: string;
  password: string;
}

export interface SignInResponseDTO {
  user: IUser;
  token: string;
  sessionId: string;
}

export type SignUpResponseDTO = IUser;

export interface IAuthSession {
  userId: string;
  username: string;
  email: string;
  sessionId: string;
  token: string;

  iss: string;
  sub: string;
  exp: number;
  iat: number;
}
