import { queryOptions, useQuery } from '@tanstack/react-query';

import { ISpace } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

import { SpaceService } from './space-service';

// QUERIES OPTIONS

export const getAllSpacesQueryOptions = () => {
  return queryOptions<IApiResponse<ISpace[]>, IApiResponse>({
    queryKey: ['spaces'],
    queryFn: async () => await SpaceService.findAllSpaces(),
  });
};

// QUERIES

export const useGetAllSpaces = ({
  queryOptions,
}: IQueryOptions<typeof getAllSpacesQueryOptions>) => {
  const query = getAllSpacesQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};
