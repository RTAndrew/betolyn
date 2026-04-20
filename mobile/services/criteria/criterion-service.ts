import { DataSync } from '@/components/server-sent-events/data-sync';
import {
  CriterionStatusEnum,
  EOddStatus,
  ICriterion,
  ICriterionMetrics,
  IOdd,
  IVoidReasonRequest,
} from '@/types';
import { getRequest, patchRequest, postRequest, putRequest } from '@/utils/http';

import { IMatchCriteriaResponse } from '../matches/matches-services';

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
  status?: EOddStatus;
}

export interface IWinningOutcome {
  id: string;
  isWinner?: boolean;
}

export class CriterionService {
  public static async findAllCriteria() {
    const data = await getRequest<ICriterion[]>('/criteria');
    DataSync.updateCriteria(data.data);
    return data;
  }

  public static async findCriterionById(criterionId: string) {
    const data = await getRequest<ICriterion & { odds: IOdd[] }>(`/criteria/${criterionId}`);
    DataSync.updateCriteria([data.data]);
    return data;
  }

  public static async getCriterionMetrics(criterionId: string) {
    return await getRequest<ICriterionMetrics>(`/criteria/${criterionId}/metrics`);
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

  public static async selectWinningOutcomes(criterionId: string, data: IWinningOutcome[]) {
    return await postRequest<ICriterion, IWinningOutcome[]>(
      `/criteria/${criterionId}/winning-outcomes`,
      data
    );
  }

  public static async setAllowMultipleWinners(criterionId: string, allowMultipleWinners: boolean) {
    return await postRequest<ICriterion, { allowMultipleWinners: boolean }>(
      `/criteria/${criterionId}/allow-multiple-winners`,
      { allowMultipleWinners }
    );
  }

  public static async void(criterionId: string, data: IVoidReasonRequest) {
    return await postRequest<null, IVoidReasonRequest>(`/criteria/${criterionId}/void`, data);
  }
}
