import { queryOptions, useQuery } from '@tanstack/react-query';
import { OddService } from './odd-service';
import { IOdd } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions, queryClient } from '@/utils/react-query';

// QUERIES OPTIONS

export const getAllOddsQueryOptions = () => {
  return queryOptions<IApiResponse<IOdd[]>, IApiResponse>({
    queryKey: ['odds'],
    queryFn: async () => await OddService.findAllOdds(),
  });
};

export const getOddByIdQueryOptions = ({ oddId }: { oddId: string }) => {
  return queryOptions<IApiResponse<IOdd>, IApiResponse>({
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
