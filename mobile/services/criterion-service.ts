import { patchRequest } from "@/utils/http";
import { IMatchCriteriaResponse } from "./matches/matches-services";

export interface IRepriceOddsRequest {
  odds: {
    id: string;
    value: number;
  }[];
}

export class CriterionService {
  public static async repriceCriterionOdds(criterionId: string, data: IRepriceOddsRequest) {
    return await patchRequest<IMatchCriteriaResponse, IRepriceOddsRequest>(`/criteria/${criterionId}/odds`, data);
  }
}
