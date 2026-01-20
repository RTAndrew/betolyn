import { IUpdateOddRequest, OddService } from "../odds/odd-service";
import { queryClient } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";
import { getMatchCriteriaQueryOptions, getMatchQueryOptions } from "../matches/match-query";

interface IUpdateOddVariables {
  oddId: string;
  matchId: string;
  variables: IUpdateOddRequest;
}

export const useUpdateOdd = () => {
  const mutation = useMutation({
    mutationFn: (data: IUpdateOddVariables) => OddService.updateOdd(data.oddId, data.variables),
    onSuccess: (_, variables) => {
      // Refetch both the match query and match criteria query to get updated data
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
