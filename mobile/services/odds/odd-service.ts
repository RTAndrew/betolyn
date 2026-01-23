import { getRequest, postRequest, putRequest } from "@/utils/http";
import { IOdd, EOddStatus } from "@/types";

export interface IUpdateOddStatusRequest {
  status: EOddStatus;
}

export interface IUpdateOddValueRequest {
  value: number;
}

export interface ICreateOddRequest {
  name: string;
  value: number;
  minimumAmount: number;
  maximumAmount: number;
  criterionId: string;
}

export class OddService {
  public static async findAllOdds() {
    return await getRequest<IOdd[]>('/odds');
  }

  public static async findOddById(oddId: string) {
    return await getRequest<IOdd>(`/odds/${oddId}`);
  }

  public static async createOdd(data: ICreateOddRequest) {
    return await postRequest<IOdd, ICreateOddRequest>('/odds', data);
  }

  public static async updateOddStatus(oddId: string, data: IUpdateOddStatusRequest) {
    return await putRequest<IOdd, IUpdateOddStatusRequest>(`/odds/${oddId}/status`, data);
  }

  public static async reprice(oddId: string, data: IUpdateOddValueRequest) {
    return await putRequest<IOdd, IUpdateOddValueRequest>(`/odds/${oddId}/value`, data);
  }
}
