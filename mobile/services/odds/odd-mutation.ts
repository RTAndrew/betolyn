import { useMutation } from '@tanstack/react-query';

import { IVoidReasonRequest } from '@/types';
import { queryClient } from '@/utils/react-query';

import { getMatchCriteriaQueryOptions, getMatchQueryOptions } from '../matches/match-query';
import {
  ICreateOddRequest,
  IUpdateOddStatusRequest,
  IUpdateOddValueRequest,
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

interface IVoidOddVariables {
  oddId: string;
  matchId: string;
  variables: IVoidReasonRequest;
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

export const useVoidOdd = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IVoidOddVariables) => OddService.void(data.oddId, data.variables),
      onSuccess: (_, variables) => {
        queryClient.refetchQueries({
          queryKey: getMatchQueryOptions({ matchId: variables.matchId }).queryKey,
        });
        queryClient.refetchQueries({
          queryKey: getMatchCriteriaQueryOptions({ matchId: variables.matchId }).queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};
