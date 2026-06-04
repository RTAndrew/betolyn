import { queryOptions, useQuery } from '@tanstack/react-query';

import { IMatch, ISpace, IUser } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

import { ISpaceMember, ISpaceMembership, SpaceService } from './space-service';

/** `staleTime` for space membership: data is fresh for 20 minutes, then may refetch on the next trigger. */
const SPACE_MEMBERSHIP_STALE_MS = 20 * 60 * 1000;

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

export const getMySpaceMembershipQueryOptions = ({ spaceId }: { spaceId: string }) => {
  return queryOptions<IApiResponse<ISpaceMembership>, IApiResponse>({
    queryKey: ['space', spaceId, 'membership'],
    queryFn: async () => await SpaceService.getMySpaceMembership(spaceId),
    staleTime: SPACE_MEMBERSHIP_STALE_MS,
  });
};

export const getSpaceMembersQueryOptions = ({
  spaceId,
  username,
}: {
  spaceId: string;
  username?: string | null;
}) => {
  const normalizedUsername = username?.trim() || null;

  return queryOptions<IApiResponse<ISpaceMember[]>, IApiResponse>({
    queryKey: ['space', spaceId, 'members', normalizedUsername],
    queryFn: async () =>
      await SpaceService.findSpaceMembers(spaceId, { username: normalizedUsername }),
  });
};

export const getSpaceCandidateMembersQueryOptions = ({
  spaceId,
  username,
}: {
  spaceId: string;
  username?: string | null;
}) => {
  const normalizedUsername = username?.trim() || null;

  return queryOptions<IApiResponse<IUser[]>, IApiResponse>({
    queryKey: ['space', spaceId, 'members', 'candidates', normalizedUsername],
    queryFn: async () =>
      await SpaceService.findSpaceCandidateMembers(spaceId, { username: normalizedUsername }),
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

export const useGetMySpaceMembership = ({
  spaceId,
  queryOptions,
}: {
  spaceId: string;
} & IQueryOptions<typeof getMySpaceMembershipQueryOptions>) => {
  const query = getMySpaceMembershipQueryOptions({ spaceId });
  return useQuery({ ...query, ...queryOptions });
};

export const useGetSpaceMembers = ({
  spaceId,
  username,
  queryOptions,
}: {
  spaceId: string;
  username?: string | null;
} & IQueryOptions<typeof getSpaceMembersQueryOptions>) => {
  const query = getSpaceMembersQueryOptions({ spaceId, username });
  return useQuery({ ...query, ...queryOptions });
};

export const useGetSpaceCandidateMembers = ({
  spaceId,
  username,
  queryOptions,
}: {
  spaceId: string;
  username?: string | null;
} & IQueryOptions<typeof getSpaceCandidateMembersQueryOptions>) => {
  const query = getSpaceCandidateMembersQueryOptions({ spaceId, username });
  return useQuery({ ...query, ...queryOptions });
};
