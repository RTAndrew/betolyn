import { queryOptions, useQuery } from '@tanstack/react-query';

import { IUser } from '@/types';
import { IApiResponse } from '@/utils/http/types';
import { IQueryOptions } from '@/utils/react-query';

import { IFindAllUsersQueryOptions } from './types';
import { UserService } from './user-service';

// QUERIES OPTIONS

export const getAllUsersQueryOptions = (params?: IFindAllUsersQueryOptions) => {
  return queryOptions<IApiResponse<IUser[]>, IApiResponse>({
    queryKey: ['users', params],
    queryFn: async () => await UserService.findAllUsers(params),
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

export const useGetAllUsers = ({
  queryOptions,
  params,
}: IQueryOptions<typeof getAllUsersQueryOptions> & { params?: IFindAllUsersQueryOptions }) => {
  const query = getAllUsersQueryOptions(params);
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
