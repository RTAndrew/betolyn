import { IUser } from '@/types';
import { getRequest } from '@/utils/http';

import { IFindAllUsersQueryOptions } from './types';

export class UserService {
  public static async findAllUsers(params?: IFindAllUsersQueryOptions) {
    return await getRequest<IUser[]>('/users', {
      params,
    });
  }

  public static async findUserById(userId: string) {
    return await getRequest<IUser>(`/users/${userId}`);
  }

  public static async findUserByUsername(username: string) {
    return await getRequest<IUser>(`/users/username/${username}`);
  }
}
