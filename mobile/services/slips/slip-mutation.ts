import { IPlaceBetRequestDTO, SlipService } from './slip-service';
import { queryClient } from '@/utils/react-query';
import { useMutation } from '@tanstack/react-query';

interface IPlaceBetVariables {
  variables: IPlaceBetRequestDTO;
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
