import { queryOptions, useQuery } from '@tanstack/react-query';

import { IMatch, ISpace } from '@/types';
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

export const getSpaceByIdQueryOptions = ({ spaceId }: { spaceId: string }) => {
  return queryOptions<IApiResponse<ISpace>, IApiResponse>({
    queryKey: ['space', spaceId],
    queryFn: async () => await SpaceService.findSpaceById(spaceId),
  });
};

export const getSpaceMatchesQueryOptions = ({ spaceId }: { spaceId: string }) => {
  return queryOptions<IApiResponse<IMatch[]>, IApiResponse>({
    queryKey: ['space', spaceId, 'matches'],
    queryFn: async () => await SpaceService.findSpaceMatches(spaceId),
  });
};

// QUERIES

export const useGetAllSpaces = ({
  queryOptions,
}: IQueryOptions<typeof getAllSpacesQueryOptions>) => {
  const query = getAllSpacesQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetSpaceById = ({
  spaceId,
  queryOptions,
}: {
  spaceId: string;
} & IQueryOptions<typeof getSpaceByIdQueryOptions>) => {
  const query = getSpaceByIdQueryOptions({ spaceId });
  return useQuery({ ...query, ...queryOptions });
};

export const useGetSpaceMatches = ({
  spaceId,
  queryOptions,
}: {
  spaceId: string;
} & IQueryOptions<typeof getSpaceMatchesQueryOptions>) => {
  const query = getSpaceMatchesQueryOptions({ spaceId });
  return useQuery({ ...query, ...queryOptions });
};
