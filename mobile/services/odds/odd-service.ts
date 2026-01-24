import { getRequest, patchRequest, postRequest, putRequest } from '@/utils/http';
import { IOdd, EOddStatus } from '@/types';
import { DataSync } from '@/server-sent-events/data-sync';

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
    const data = await getRequest<IOdd[]>('/odds');
    // DataSync.updateOdds(data.data);
    return data;
  }

  public static async findOddById(oddId: string) {
    const data = await getRequest<IOdd>(`/odds/${oddId}`);
    DataSync.updateOdds([data.data]);
    return data;
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

  public static async publishOdd(oddId: string) {
    return await patchRequest<IOdd, void>(`/odds/${oddId}/publish`);
  }

  public static async suspendOdd(oddId: string) {
    return await putRequest<IOdd, unknown>(`/odds/${oddId}/status`, {
      status: EOddStatus.SUSPENDED as EOddStatus,
    });
  }
}
