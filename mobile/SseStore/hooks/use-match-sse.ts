import { useQuery } from "@tanstack/react-query";
import { MatchesSseStore } from "../stores/MatchesSse.store";
import { sseClientStore } from "../provider";
import { IMatch } from "@/types";

export const useMatchSSE = (id: string) => {
  return useQuery<IMatch | undefined>(
    {
      queryKey: ['match-sse', id],
      queryFn: () => {
        return MatchesSseStore.getMatch(id);
      },
    },
    sseClientStore
  );
};
