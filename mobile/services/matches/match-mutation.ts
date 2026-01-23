import {
  IUpdateMatchScoreRequest,
  ICreateMatchRequest,
  IUpdateMatchMainCriterionRequest,
  IRescheduleMatchRequest,
  IUpdateMatchStatusRequest,
  MatchesService,
} from "./matches-services";
import { queryClient } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";
import { getMatchQueryOptions, getMatchesQueryOptions } from "./match-query";

interface IUpdateMatchScoreVariables {
  matchId: string;
  variables: IUpdateMatchScoreRequest;
}

interface ICreateMatchVariables {
  variables: ICreateMatchRequest;
}

interface IUpdateMatchMainCriterionVariables {
  matchId: string;
  variables: IUpdateMatchMainCriterionRequest;
}

interface IRescheduleMatchVariables {
  matchId: string;
  variables: IRescheduleMatchRequest;
}

interface IUpdateMatchStatusVariables {
  matchId: string;
  variables: IUpdateMatchStatusRequest;
}

export const useUpdateMatchScore = () => {
  const mutation = useMutation({
    mutationFn: (data: IUpdateMatchScoreVariables) => MatchesService.updateMatchScore(data.matchId, data.variables),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: getMatchQueryOptions({ matchId: data.data.id }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getMatchesQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};

export const useCreateMatch = () => {
  const mutation = useMutation({
    mutationFn: (data: ICreateMatchVariables) => MatchesService.createMatch(data.variables),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getMatchesQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};

export const useUpdateMatchMainCriterion = () => {
  const mutation = useMutation({
    mutationFn: (data: IUpdateMatchMainCriterionVariables) =>
      MatchesService.updateMatchMainCriterion(data.matchId, data.variables),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: getMatchQueryOptions({ matchId: variables.matchId }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getMatchesQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};

export const useRescheduleMatch = () => {
  const mutation = useMutation({
    mutationFn: (data: IRescheduleMatchVariables) => MatchesService.rescheduleMatch(data.matchId, data.variables),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: getMatchQueryOptions({ matchId: variables.matchId }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getMatchesQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};

export const useUpdateMatchStatus = () => {
  const mutation = useMutation({
    mutationFn: (data: IUpdateMatchStatusVariables) => MatchesService.updateMatchStatus(data.matchId, data.variables),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: getMatchQueryOptions({ matchId: variables.matchId }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getMatchesQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};