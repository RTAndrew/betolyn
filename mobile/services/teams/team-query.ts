import { queryOptions, useQuery } from '@tanstack/react-query';
import { TeamService } from './team-service';
import { ITeam } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

// QUERIES OPTIONS

export const getAllTeamsQueryOptions = () => {
  return queryOptions<IApiResponse<ITeam[]>, IApiResponse>({
    queryKey: ['teams'],
    queryFn: async () => await TeamService.findAllTeams(),
  });
};

export const getTeamByIdQueryOptions = ({ teamId }: { teamId: string }) => {
  return queryOptions<IApiResponse<ITeam>, IApiResponse>({
    queryKey: ['team', teamId],
    queryFn: async () => await TeamService.findTeamById(teamId),
  });
};

// QUERIES

export const useGetAllTeams = ({ queryOptions }: IQueryOptions<typeof getAllTeamsQueryOptions>) => {
  const query = getAllTeamsQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetTeamById = ({ teamId }: { teamId: string }) => {
  const query = getTeamByIdQueryOptions({ teamId });
  return useQuery(query);
};
