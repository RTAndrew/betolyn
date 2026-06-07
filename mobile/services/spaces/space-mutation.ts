import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query';

import { getMatchQueryOptions, getMatchesQueryOptions } from '../matches/match-query';
import {
  getAllSpacesQueryOptions,
  getSpaceByIdQueryOptions,
  getSpaceMatchesQueryOptions,
  getSpaceMemberByIdQueryOptions,
  getSpaceMembersQueryOptions,
} from './space-query';
import {
  IAddOrRemoveMemberAsAdminRequest,
  IAddSpaceMembersRequest,
  IAllocateSpaceFundingRequest,
  ICreateSpaceRequest,
  SpaceService,
} from './space-service';

interface ICreateSpaceVariables {
  variables: ICreateSpaceRequest;
}

interface IAllocateSpaceFundingVariables {
  spaceId: string;
  variables: IAllocateSpaceFundingRequest;
}

interface ICreateSpaceMatchVariables {
  spaceId: string;
  variables: Parameters<typeof SpaceService.createSpaceMatch>[1];
}

interface IAddSpaceMembersVariables {
  spaceId: string;
  variables: IAddSpaceMembersRequest;
}

interface IAddOrRemoveMemberAsAdminVariables {
  spaceId: string;
  memberId: string;
  variables: IAddOrRemoveMemberAsAdminRequest;
}

export const useCreateSpace = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ICreateSpaceVariables) => SpaceService.create(data.variables),
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: getAllSpacesQueryOptions().queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};

export const useAllocateSpaceFunding = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IAllocateSpaceFundingVariables) =>
        SpaceService.allocateFunding(data.spaceId, data.variables),
      onSuccess: (_response, variables) => {
        queryClient.invalidateQueries({
          queryKey: getSpaceByIdQueryOptions({ spaceId: variables.spaceId }).queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};

export const useCreateSpaceMatch = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ICreateSpaceMatchVariables) =>
        SpaceService.createSpaceMatch(data.spaceId, data.variables),
      onSuccess: (response, variables) => {
        const match = response.data;
        queryClient.invalidateQueries({
          queryKey: getSpaceByIdQueryOptions({ spaceId: variables.spaceId }).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: getSpaceMatchesQueryOptions({ spaceId: variables.spaceId }).queryKey,
        });
        queryClient.refetchQueries({
          queryKey: getAllSpacesQueryOptions().queryKey,
        });
        if (match?.id) {
          queryClient.invalidateQueries({
            queryKey: getMatchQueryOptions({ matchId: match.id }).queryKey,
          });
        }
        queryClient.invalidateQueries({
          queryKey: getMatchesQueryOptions().queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};

export const useAddSpaceMembers = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IAddSpaceMembersVariables) =>
        SpaceService.addMembers(data.spaceId, data.variables),
      onSuccess: (_response, variables) => {
        queryClient.invalidateQueries({
          queryKey: getSpaceMembersQueryOptions({ spaceId: variables.spaceId }).queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};

export const useAddOrRemoveMemberAsAdmin = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IAddOrRemoveMemberAsAdminVariables) =>
        SpaceService.addOrRemoveMemberAsAdmin(data.spaceId, data.memberId, data.variables),
      onSuccess: (_response, variables) => {
        queryClient.invalidateQueries({
          queryKey: getSpaceMemberByIdQueryOptions({
            spaceId: variables.spaceId,
            memberId: variables.memberId,
          }).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: getSpaceMembersQueryOptions({ spaceId: variables.spaceId }).queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};
