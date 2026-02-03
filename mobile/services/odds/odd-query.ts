import { queryOptions, useQuery } from '@tanstack/react-query';
import { OddService } from './odd-service';

import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

type IOdd = Awaited<ReturnType<typeof OddService.findOddById>>;
type IAllOdds = Awaited<ReturnType<typeof OddService.findAllOdds>>;

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

// QUERIES

export const useGetAllOdds = ({ queryOptions }: IQueryOptions<typeof getAllOddsQueryOptions>) => {
  const query = getAllOddsQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetOddById = ({ oddId }: { oddId: string }) => {
  const query = getOddByIdQueryOptions({ oddId });
  return useQuery(query);
};
