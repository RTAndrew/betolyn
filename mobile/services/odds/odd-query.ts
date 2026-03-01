import { queryOptions, useQuery } from '@tanstack/react-query';
import { OddService } from './odd-service';

import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

type IOdd = Awaited<ReturnType<typeof OddService.findOddById>>;
type IAllOdds = Awaited<ReturnType<typeof OddService.findAllOdds>>;
type IOddMetricsResponse = Awaited<ReturnType<typeof OddService.findOddMetrics>>;

// QUERIES OPTIONS

export const getAllOddsQueryOptions = () => {
  return queryOptions<IAllOdds, IApiResponse>({
    queryKey: ['odds'],
    queryFn: async () => await OddService.findAllOdds(),
  });
};

export const getOddByIdQueryOptions = ({ oddId }: { oddId: string }) => {
  return queryOptions<IOdd, IApiResponse>({
    queryKey: ['odd', oddId],
    queryFn: async () => await OddService.findOddById(oddId),
  });
};

export const getOddMetricsQueryOptions = ({ oddId }: { oddId: string }) => {
  return queryOptions<IOddMetricsResponse, IApiResponse>({
    queryKey: ['odd', oddId, 'metrics'],
    queryFn: async () => await OddService.findOddMetrics(oddId),
  });
};

// QUERIES

export const useGetAllOdds = ({ queryOptions }: IQueryOptions<typeof getAllOddsQueryOptions>) => {
  const query = getAllOddsQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetOddById = ({
  oddId,
  queryOptions,
}: { oddId: string } & IQueryOptions<typeof getOddByIdQueryOptions>) => {
  const query = getOddByIdQueryOptions({ oddId });
  return useQuery({ ...query, ...queryOptions });
};

export const useGetOddMetrics = ({
  oddId,
  queryOptions,
}: { oddId: string } & IQueryOptions<typeof getOddMetricsQueryOptions>) => {
  const query = getOddMetricsQueryOptions({ oddId });
  return useQuery({ ...query, ...queryOptions });
};
