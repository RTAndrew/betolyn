import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query';

import { getMatchQueryOptions, getMatchesQueryOptions } from '../matches/match-query';
import { getAllSpacesQueryOptions, getSpaceByIdQueryOptions } from './space-query';
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
        const spaceMatch = response.data;
        queryClient.invalidateQueries({
          queryKey: getSpaceByIdQueryOptions({ spaceId: variables.spaceId }).queryKey,
        });
        queryClient.refetchQueries({
          queryKey: getAllSpacesQueryOptions().queryKey,
        });
        const linkedMatchId = spaceMatch?.matchId ?? spaceMatch?.match?.id;
        if (linkedMatchId) {
          queryClient.invalidateQueries({
            queryKey: getMatchQueryOptions({ matchId: linkedMatchId }).queryKey,
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
