import { useMutation } from '@tanstack/react-query';

import { IVoidReasonRequest } from '@/types';
import { queryClient } from '@/utils/react-query';

import { getMatchCriteriaQueryOptions, getMatchQueryOptions } from '../matches/match-query';
import {
  CriterionService,
  ICreateCriterionRequest,
  IRepriceOddsRequest,
  IUpdateCriterionStatusRequest,
  IWinningOutcome,
} from './criterion-service';

interface IRepriceCriterionOddsVariables {
  criterionId: string;
  matchId: string;
  variables: IRepriceOddsRequest;
}

interface ISuspendCriterionVariables {
  criterionId: string;
  matchId: string;
  variables: IUpdateCriterionStatusRequest;
}

interface ICreateCriterionVariables {
  variables: ICreateCriterionRequest;
}

interface ISelectWinningOutcomesVariables {
  criterionId: string;
  odds: IWinningOutcome[];
}

interface ISetAllowMultipleWinnersVariables {
  criterionId: string;
  allowMultipleWinners: boolean;
}

interface IVoidCriterionVariables {
  criterionId: string;
  matchId: string;
  variables: IVoidReasonRequest;
}

export const useRepriceCriterionOdds = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IRepriceCriterionOddsVariables) =>
        CriterionService.repriceCriterionOdds(data.criterionId, data.variables),
      onSuccess: (_, variables) => {
        // Refetch both the match query and match criteria query to get updated data
        // because the match screen
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

export const useSuspendCriterion = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ISuspendCriterionVariables) => CriterionService.suspend(data.criterionId),
    },
    queryClient
  );

  return mutation;
};

export const useCreateCriterion = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ICreateCriterionVariables) =>
        CriterionService.createCriterion(data.variables),
    },
    queryClient
  );

  return mutation;
};

export const usePublishCriterion = () => {
  const mutation = useMutation(
    {
      mutationFn: (criterionId: string) => CriterionService.publish(criterionId),
    },
    queryClient
  );

  return mutation;
};

export const useSelectWinningOutcomes = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ISelectWinningOutcomesVariables) =>
        CriterionService.selectWinningOutcomes(data.criterionId, data.odds),
    },
    queryClient
  );

  return mutation;
};

export const useSetAllowMultipleWinners = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ISetAllowMultipleWinnersVariables) =>
        CriterionService.setAllowMultipleWinners(data.criterionId, data.allowMultipleWinners),
    },
    queryClient
  );

  return mutation;
};

export const useVoidCriterion = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: IVoidCriterionVariables) =>
        CriterionService.void(data.criterionId, data.variables),
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
