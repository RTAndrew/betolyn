import { useQuery } from '@tanstack/react-query';
import { MatchesSseStore } from '../stores/MatchesSse.store';
import { sseClientStore } from '../provider';
import { IMatch } from '@/types';

export const useMatchesSSE = () => {
  return useQuery<Record<string, IMatch>>(
    {
      queryKey: ['matches-sse'],
      queryFn: () => {
        return MatchesSseStore.getMatches();
      },
    },
    sseClientStore
  );
};
