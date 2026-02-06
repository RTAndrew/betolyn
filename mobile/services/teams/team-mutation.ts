import { ICreateTeamRequest, TeamService } from './team-service';
import { queryClient } from '@/utils/react-query';
import { useMutation } from '@tanstack/react-query';
import { getAllTeamsQueryOptions, getTeamByIdQueryOptions } from './team-query';

interface ICreateTeamVariables {
  variables: ICreateTeamRequest;
}

export const useCreateTeam = () => {
  const mutation = useMutation(
    {
      mutationFn: (data: ICreateTeamVariables) => TeamService.createTeam(data.variables),
      onSuccess: (data) => {
        queryClient.refetchQueries({
          queryKey: getAllTeamsQueryOptions().queryKey,
        });
        queryClient.refetchQueries({
          queryKey: getTeamByIdQueryOptions({ teamId: data.data.id }).queryKey,
        });
      },
    },
    queryClient
  );

  return mutation;
};
