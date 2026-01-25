import { getRequest, postRequest, putRequest, patchRequest } from "@/utils/http";
import { IMatchCriteriaResponse } from "../matches/matches-services";
import { CriterionStatusEnum, ICriterion } from '@/types';
import { DataSync } from '@/server-sent-events/data-sync';

export interface IRepriceOddsRequest {
  odds: {
    id: string;
    value: number;
  }[];
}

export interface IUpdateCriterionStatusRequest {
  status: CriterionStatusEnum;
}

export interface ICreateCriterionRequest {
  name: string;
  matchId: string;
  allowMultipleOdds: boolean;
  status?: CriterionStatusEnum;
  odds?: ICreateCriterionOddRequest[];
}

export interface ICreateCriterionOddRequest {
  name: string;
  value: number;
  status?: CriterionStatusEnum;
}

export class CriterionService {
  public static async findAllCriteria() {
    const data = await getRequest<ICriterion[]>('/criteria');
    DataSync.updateCriteria(data.data);
    return data;
  }

  public static async findCriterionById(criterionId: string) {
    const data = await getRequest<ICriterion>(`/criteria/${criterionId}`);
    DataSync.updateCriteria([data.data]);
    return data;
  }

  public static async createCriterion(data: ICreateCriterionRequest) {
    return await postRequest<ICriterion, ICreateCriterionRequest>('/criteria', data);
  }

  public static async repriceCriterionOdds(criterionId: string, data: IRepriceOddsRequest) {
    return await patchRequest<IMatchCriteriaResponse, IRepriceOddsRequest>(
      `/criteria/${criterionId}/odds`,
      data
    );
  }

  public static async updateCriterionStatus(
    criterionId: string,
    data: IUpdateCriterionStatusRequest
  ) {
    return await putRequest<ICriterion, IUpdateCriterionStatusRequest>(
      `/criteria/${criterionId}/status`,
      data
    );
  }

  public static async publish(criterionId: string) {
    return await patchRequest<ICriterion>(`/criteria/${criterionId}/publish`);
  }

  public static async suspend(criterionId: string) {
    return await patchRequest<ICriterion>(`/criteria/${criterionId}/suspend`);
  }
}
