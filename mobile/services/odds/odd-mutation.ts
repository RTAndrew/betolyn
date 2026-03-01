import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query';

import {
  IUpdateOddStatusRequest,
  IUpdateOddValueRequest,
  ICreateOddRequest,
  OddService,
} from '../odds/odd-service';

interface IUpdateOddStatusVariables {
  oddId: string;
  matchId: string;
  variables: IUpdateOddStatusRequest;
}

interface IUpdateOddValueVariables {
  oddId: string;
  matchId: string;
  variables: IUpdateOddValueRequest;
}

interface ICreateOddVariables {
  variables: ICreateOddRequest;
}

export const useUpdateOddStatus = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IUpdateOddStatusVariables) =>
        OddService.updateOddStatus(data.oddId, data.variables),
    },
    queryClient
  );

  return mutation;
};

export const usePublishOdd = () => {
  const mutation = useMutation(
    {
      mutationFn: (oddId: string) => OddService.publishOdd(oddId),
    },
    queryClient
  );
  return mutation;
};

export const useSuspendOdd = () => {
  const mutation = useMutation(
    {
      mutationFn: (oddId: string) => OddService.suspend(oddId),
    },
    queryClient
  );
  return mutation;
};

export const useRepriceOdd = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IUpdateOddValueVariables) =>
        OddService.reprice(data.oddId, data.variables),
    },
    queryClient
  );

  return mutation;
};

export const useCreateOdd = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ICreateOddVariables) => OddService.createOdd(data.variables),
    },
    queryClient
  );

  return mutation;
};
