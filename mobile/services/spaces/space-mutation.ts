import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query';

import { getMatchQueryOptions, getMatchesQueryOptions } from '../matches/match-query';
import {
  getAllSpacesQueryOptions,
  getSpaceByIdQueryOptions,
  getSpaceMatchesQueryOptions,
} from './space-query';
import { ICreateSpaceRequest, SpaceService } from './space-service';

interface ICreateSpaceVariables {
  variables: ICreateSpaceRequest;
}

interface ICreateSpaceMatchVariables {
  spaceId: string;
  variables: Parameters<typeof SpaceService.createSpaceMatch>[1];
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
