import { queryOptions, useQuery } from '@tanstack/react-query';

import { CriterionStatusEnum, IMatch, IMatchMetrics } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

import { IMatchCriteriaResponse, MatchesService } from './matches-services';

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

export const getMatchCriteriaQueryOptions = ({
  matchId,
  queryParams,
}: {
  matchId: string;
  queryParams?: { status?: CriterionStatusEnum[] };
}) => {
  return queryOptions<IApiResponse<IMatchCriteriaResponse[]>, IApiResponse>({
    queryKey: ['match-criteria', matchId, queryParams ?? null],
    queryFn: async () => await MatchesService.getMatchCriteria(matchId, queryParams),
  });
};

export const getMatchMetricsQueryOptions = ({ matchId }: { matchId: string }) => {
  return queryOptions<IApiResponse<IMatchMetrics>, IApiResponse>({
    queryKey: ['match-metrics', matchId],
    queryFn: async () => await MatchesService.getMatchMetrics(matchId),
  });
};

// QUERIES

export const useGetMatch = ({
  matchId,
  queryOptions,
}: {
  matchId: string;
} & IQueryOptions<typeof getMatchQueryOptions>) => {
  const query = getMatchQueryOptions({ matchId });
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMatches = ({ queryOptions }: IQueryOptions<typeof getMatchesQueryOptions>) => {
  const query = getMatchesQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMatchCriteria = ({
  matchId,
  queryParams,
  queryOptions,
}: {
  matchId: string;
  queryParams?: { status?: CriterionStatusEnum[] };
} & IQueryOptions<typeof getMatchCriteriaQueryOptions>) => {
  const query = getMatchCriteriaQueryOptions({ matchId, queryParams });
  return useQuery({ ...query, ...queryOptions });
};

export const useGetMatchMetrics = ({
  matchId,
  queryOptions,
}: { matchId: string } & IQueryOptions<typeof getMatchMetricsQueryOptions>) => {
  const query = getMatchMetricsQueryOptions({ matchId });
  return useQuery({ ...query, ...queryOptions });
};
