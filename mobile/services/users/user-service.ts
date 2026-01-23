import { getRequest } from "@/utils/http";
import { IUser } from "@/types";

export class UserService {
  public static async findAllUsers() {
    return await getRequest<IUser[]>('/users');
  }

  public static async findUserById(userId: string) {
    return await getRequest<IUser>(`/users/${userId}`);
  }

  public static async findUserByUsername(username: string) {
    return await getRequest<IUser>(`/users/username/${username}`);
  }
}
