import { queryOptions, useQuery } from '@tanstack/react-query';

import { IBetSlip } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

import { IMe, MeService } from '../me-service';

// QUERIES OPTIONS

export const getMeQueryOptions = () => {
  return queryOptions<IApiResponse<IMe>, IApiResponse>({
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

export const useGetMe = ({ queryOptions }: IQueryOptions<typeof getMeQueryOptions>) => {
  const query = getMeQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMyBets = ({ queryOptions }: IQueryOptions<typeof getMyBetsQueryOptions>) => {
  const query = getMyBetsQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};
