import { patchRequest } from "@/utils/http";
import { IMatchCriteriaResponse } from "../matches/matches-services";
import { CriterionStatusEnum } from "@/types";

export interface IRepriceOddsRequest {
  odds: {
    id: string;
    value: number;
  }[];
}

export interface IUpdateCriterionStatusRequest {
  status: CriterionStatusEnum;
}

export class CriterionService {
  public static async repriceCriterionOdds(criterionId: string, data: IRepriceOddsRequest) {
    return await patchRequest<IMatchCriteriaResponse, IRepriceOddsRequest>(`/criteria/${criterionId}/odds`, data);
  }

  public static async updateCriterionStatus(criterionId: string, data: IUpdateCriterionStatusRequest) {
    return await patchRequest<IMatchCriteriaResponse, IUpdateCriterionStatusRequest>(`/criteria/${criterionId}`, data);
  }
}
