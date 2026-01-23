import { getRequest, postRequest } from "@/utils/http";
import { ITeam } from "@/types";

export interface ICreateTeamRequest {
  name: string;
  badgeUrl?: string;
}

export class TeamService {
  public static async findAllTeams() {
    return await getRequest<ITeam[]>('/teams');
  }

  public static async findTeamById(teamId: string) {
    return await getRequest<ITeam>(`/teams/${teamId}`);
  }

  public static async createTeam(data: ICreateTeamRequest) {
    return await postRequest<ITeam, ICreateTeamRequest>('/teams', data);
  }
}
