import { patchRequest } from "@/utils/http";
import { IOdd,EOddStatus } from "@/types";

export interface IUpdateOddRequest {
  status?: `${EOddStatus}`;
  value?: number;
}

export class OddService {
  public static async updateOdd(oddId: string, data: IUpdateOddRequest) {
    return await patchRequest<IOdd, IUpdateOddRequest>(`/odds/${oddId}`, data);
  }
}
