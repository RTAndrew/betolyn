import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query';

import { IPlaceBetRequest, SlipService } from './slip-service';

interface IPlaceBetVariables {
  variables: IPlaceBetRequest;
}

export const usePlaceBet = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IPlaceBetVariables) => SlipService.placeBet(data.variables),
    },
    queryClient
  );

  return mutation;
};
