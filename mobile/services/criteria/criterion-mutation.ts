import {
  IRepriceOddsRequest,
  IUpdateCriterionStatusRequest,
  ICreateCriterionRequest,
  CriterionService,
} from "./criterion-service";
import { queryClient } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";
import { getMatchCriteriaQueryOptions, getMatchQueryOptions } from "../matches/match-query";
import { getAllCriteriaQueryOptions } from './criterion-query';

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

export const useRepriceCriterionOdds = () => {
  const mutation = useMutation({
    mutationFn: (data: IRepriceCriterionOddsVariables) => CriterionService.repriceCriterionOdds(data.criterionId, data.variables),
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
  }, queryClient);

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
  const mutation = useMutation({
    mutationFn: (data: ICreateCriterionVariables) => CriterionService.createCriterion(data.variables),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: getAllCriteriaQueryOptions().queryKey,
      });
      if (data.data.match?.id) {
        queryClient.refetchQueries({
          queryKey: getMatchQueryOptions({ matchId: data.data.match.id }).queryKey,
        });
        queryClient.refetchQueries({
          queryKey: getMatchCriteriaQueryOptions({ matchId: data.data.match.id }).queryKey,
        });
      }
    },
  }, queryClient);

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

