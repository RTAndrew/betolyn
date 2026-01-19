
import { IUpdateMatchScoreRequest, MatchesService } from "./matches-services";
import { queryClient } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";
import { getMatchQueryOptions } from "./match-query";


interface IUpdateMatchScoreVariables {
  matchId: string;
  variables: IUpdateMatchScoreRequest;
}

export const useUpdateMatchScore = () => {
  const mutation = useMutation({
    mutationFn: (data: IUpdateMatchScoreVariables) => MatchesService.updateMatchScore(data.matchId, data.variables),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: getMatchQueryOptions({ matchId: data.data.id }).queryKey,
      })
    },
  }, queryClient);

  return mutation;
};