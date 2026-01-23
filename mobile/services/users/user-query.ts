import { queryOptions, useQuery } from '@tanstack/react-query';
import { UserService } from './user-service';
import { IUser } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

// QUERIES OPTIONS

export const getAllUsersQueryOptions = () => {
  return queryOptions<IApiResponse<IUser[]>, IApiResponse>({
    queryKey: ['users'],
    queryFn: async () => await UserService.findAllUsers(),
  });
};

export const getUserByIdQueryOptions = ({ userId }: { userId: string }) => {
  return queryOptions<IApiResponse<IUser>, IApiResponse>({
    queryKey: ['user', userId],
    queryFn: async () => await UserService.findUserById(userId),
  });
};

export const getUserByUsernameQueryOptions = ({ username }: { username: string }) => {
  return queryOptions<IApiResponse<IUser>, IApiResponse>({
    queryKey: ['user', 'username', username],
    queryFn: async () => await UserService.findUserByUsername(username),
  });
};

// QUERIES

export const useGetAllUsers = ({ queryOptions }: IQueryOptions<typeof getAllUsersQueryOptions>) => {
  const query = getAllUsersQueryOptions();
  return useQuery({ ...query, ...queryOptions });
};

export const useGetUserById = ({ userId }: { userId: string }) => {
  const query = getUserByIdQueryOptions({ userId });
  return useQuery(query);
};

export const useGetUserByUsername = ({ username }: { username: string }) => {
  const query = getUserByUsernameQueryOptions({ username });
  return useQuery(query);
};
