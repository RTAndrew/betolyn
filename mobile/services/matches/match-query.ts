import { queryOptions, useQuery } from '@tanstack/react-query';
import { IMatchCriteriaResponse, MatchesService } from './matches-services';
import { IMatch } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

// QUERIES OPTIONS

export const getMatchQueryOptions = ({ matchId }: { matchId: string }) => {
  return queryOptions<IApiResponse<IMatch>, IApiResponse>({
    queryKey: ['match', matchId],
    queryFn: async () => await MatchesService.getMatch(matchId),
  });
};

export const getMatchesQueryOptions = () => {
  return queryOptions<IApiResponse<IMatch[]>, IApiResponse>({
    queryKey: ['matches'],
    queryFn: MatchesService.getMatches,
  });
};

export const getMatchCriteriaQueryOptions = ({ matchId }: { matchId: string }) => {
  return queryOptions<IApiResponse<IMatchCriteriaResponse[]>, IApiResponse>({
    queryKey: ['match-criteria', matchId],
    queryFn: async () => await MatchesService.getMatchCriteria(matchId),
  });
};

// QUERIES

export const useGetMatch = ({ matchId }: { matchId: string }) => {
  const query = getMatchQueryOptions({ matchId });
  return useQuery(query);
};

export const useGetMatches = ({ queryOptions }: IQueryOptions<typeof getMatchesQueryOptions>) => {
  const query = getMatchesQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMatchCriteria = ({ matchId }: { matchId: string }) => {
  const query = getMatchCriteriaQueryOptions({ matchId });
  return useQuery(query);
};
