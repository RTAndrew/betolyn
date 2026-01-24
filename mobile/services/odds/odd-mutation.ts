import {
  IUpdateOddStatusRequest,
  IUpdateOddValueRequest,
  ICreateOddRequest,
  OddService,
} from "../odds/odd-service";
import { queryClient } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";
import { getMatchCriteriaQueryOptions, getMatchQueryOptions } from "../matches/match-query";
import { getAllOddsQueryOptions, getOddByIdQueryOptions } from "./odd-query";

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
  const mutation = useMutation({
    mutationFn: (data: IUpdateOddStatusVariables) => OddService.updateOddStatus(data.oddId, data.variables),
    onSuccess: (_, variables) => {
      // Refetch both the match query and match criteria query to get updated data
      queryClient.refetchQueries({
        queryKey: getMatchQueryOptions({ matchId: variables.matchId }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getMatchCriteriaQueryOptions({ matchId: variables.matchId }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getOddByIdQueryOptions({ oddId: variables.oddId }).queryKey,
      });
      queryClient.refetchQueries({
        queryKey: getAllOddsQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};

export const useRepriceOdd = () => {
  const mutation = useMutation({
    mutationFn: (data: IUpdateOddValueVariables) => OddService.reprice(data.oddId, data.variables),
    onSuccess: (_, variables) => {
      // Refetch both the match query and match criteria query to get updated data
      // queryClient.refetchQueries({
      //   queryKey: getMatchQueryOptions({ matchId: variables.matchId }).queryKey,
      // });
      // queryClient.refetchQueries({
      //   queryKey: getMatchCriteriaQueryOptions({ matchId: variables.matchId }).queryKey,
      // });
    },
  }, queryClient);

  return mutation;
};

export const useCreateOdd = () => {
  const mutation = useMutation({
    mutationFn: (data: ICreateOddVariables) => OddService.createOdd(data.variables),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getAllOddsQueryOptions().queryKey,
      });
    },
  }, queryClient);

  return mutation;
};

