import { getRequest, postRequest, putRequest, patchRequest } from "@/utils/http";
import { IMatchCriteriaResponse } from "../matches/matches-services";
import { CriterionStatusEnum, ICriteria } from "@/types";

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
    return await getRequest<ICriteria[]>('/criteria');
  }

  public static async findCriterionById(criterionId: string) {
    return await getRequest<ICriteria>(`/criteria/${criterionId}`);
  }

  public static async createCriterion(data: ICreateCriterionRequest) {
    return await postRequest<ICriteria, ICreateCriterionRequest>('/criteria', data);
  }

  public static async repriceCriterionOdds(criterionId: string, data: IRepriceOddsRequest) {
    return await patchRequest<IMatchCriteriaResponse, IRepriceOddsRequest>(`/criteria/${criterionId}/odds`, data);
  }

  public static async updateCriterionStatus(criterionId: string, data: IUpdateCriterionStatusRequest) {
    return await putRequest<ICriteria, IUpdateCriterionStatusRequest>(`/criteria/${criterionId}/status`, data);
  }

  public static async publishCriterion(criterionId: string) {
    return await patchRequest<ICriteria, void>(`/criteria/${criterionId}/publish`, undefined);
  }
}
