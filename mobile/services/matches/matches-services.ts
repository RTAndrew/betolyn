import { ICriteria, IMatch, IOdd } from "@/types";
import { getRequest, patchRequest } from "@/utils/http";

export interface IMatchCriteriaResponse extends ICriteria {
  odds: IOdd[];
}

export interface IUpdateMatchScoreRequest {
    homeTeamScore: number;
    awayTeamScore: number;
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

  public static async updateMatchScore(matchId: string, data: IUpdateMatchScoreRequest) {
    return await patchRequest<IMatch, IUpdateMatchScoreRequest>(`/matches/${matchId}`, data);
  }
}