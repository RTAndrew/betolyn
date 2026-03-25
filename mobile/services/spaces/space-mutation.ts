import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query';

import { getAllSpacesQueryOptions } from './space-query';
import { ICreateSpaceRequest, SpaceService } from './space-service';

interface ICreateSpaceVariables {
  variables: ICreateSpaceRequest;
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
