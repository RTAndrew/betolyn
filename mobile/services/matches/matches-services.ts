import { ICriteria, IMatch, IOdd, MatchStatusEnum } from "@/types";
import { getRequest, postRequest, putRequest, patchRequest } from "@/utils/http";

export interface IMatchCriteriaResponse extends ICriteria {
  odds: IOdd[];
}

export interface IUpdateMatchScoreRequest {
  homeTeamScore: number;
  awayTeamScore: number;
}

export interface ICreateMatchRequest {
  homeTeamId: string;
  awayTeamId: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  startTime: string;
  endTime?: string | null;
}

export interface IUpdateMatchMainCriterionRequest {
  criterionId: string;
}

export interface IRescheduleMatchRequest {
  startTime: string;
  endTime?: string | null;
  status: MatchStatusEnum;
}

export interface IUpdateMatchStatusRequest {
  status: MatchStatusEnum;
}

export class MatchesService {
  public static async getMatch(matchId: string) {
    return await getRequest<IMatch>(`/matches/${matchId}`);
  }

  public static async getMatches() {
    return await getRequest<IMatch[]>('/matches');
  }

  public static async getMatchCriteria(matchId: string) {
    return await getRequest<IMatchCriteriaResponse[]>(`/matches/${matchId}/criteria`);
  }

  public static async createMatch(data: ICreateMatchRequest) {
    return await postRequest<IMatch, ICreateMatchRequest>('/matches', data);
  }

  public static async updateMatchScore(matchId: string, data: IUpdateMatchScoreRequest) {
    return await postRequest<IMatch, IUpdateMatchScoreRequest>(`/matches/${matchId}/score`, data);
  }

  public static async updateMatchMainCriterion(matchId: string, data: IUpdateMatchMainCriterionRequest) {
    return await putRequest<IMatch, IUpdateMatchMainCriterionRequest>(`/matches/${matchId}/main-criterion`, data);
  }

  public static async rescheduleMatch(matchId: string, data: IRescheduleMatchRequest) {
    return await patchRequest<IMatch, IRescheduleMatchRequest>(`/matches/${matchId}/reschedule`, data);
  }

  public static async updateMatchStatus(matchId: string, data: IUpdateMatchStatusRequest) {
    return await putRequest<IMatch, IUpdateMatchStatusRequest>(`/matches/${matchId}/status`, data);
  }
}