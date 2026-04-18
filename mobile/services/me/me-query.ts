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

export const getBetSlipItemByIdQueryOptions = ({ id }: { id: string }) => {
  return queryOptions<IApiResponse<IBetSlip['items'][number]>, IApiResponse>({
    queryKey: ['me', 'bets', 'items', id],
    queryFn: () => MeService.getBetSlipItemById(id),
  });
};

export const getBetSlipQueryOptions = ({ betSlipId }: { betSlipId: string }) => {
  return queryOptions<IApiResponse<IBetSlip>, IApiResponse>({
    queryKey: ['me', 'bets', betSlipId],
    queryFn: () => MeService.getBetSlipById(betSlipId),
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

export const useGetBetSlipItemById = ({
  id,
  queryOptions,
}: { id: string } & IQueryOptions<typeof getBetSlipItemByIdQueryOptions>) => {
  const query = getBetSlipItemByIdQueryOptions({ id });
  return useQuery({ ...query, ...queryOptions });
};
