import { ISpace } from '@/types';
import { getRequest, postRequest } from '@/utils/http';

export interface ICreateSpaceRequest {
  name: string;
  description?: string | null;
  userIds?: string[] | null;
}

export class SpaceService {
  public static async findAllSpaces() {
    return await getRequest<ISpace[]>('/spaces');
  }

  public static async create(data: ICreateSpaceRequest) {
    return await postRequest<ISpace, ICreateSpaceRequest>('/spaces', data);
  }
}
