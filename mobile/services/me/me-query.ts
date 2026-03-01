import { queryOptions, useQuery } from '@tanstack/react-query';

import { SignInResponseDTO } from '@/app/auth/signup/types';
import { IBetSlip } from '@/types';
import { IApiResponse } from '@/utils/http/types';

import { MeService } from '../me-service';

// QUERIES OPTIONS

export const getMeQueryOptions = () => {
  return queryOptions<IApiResponse<SignInResponseDTO>, IApiResponse>({
    queryKey: ['me'],
    queryFn: () => MeService.getMe(),
  });
};

export const getMyBetsQueryOptions = () => {
  return queryOptions<IApiResponse<IBetSlip[]>, IApiResponse>({
    queryKey: ['me', 'bets'],
    queryFn: () => MeService.getMyBets(),
  });
};

// QUERIES

export const useGetMe = () => {
  const query = getMeQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMyBets = () => {
  const query = getMyBetsQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};
