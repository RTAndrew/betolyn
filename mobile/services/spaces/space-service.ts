import { ESpaceCreateEventType, IMatch, ISpace, TSpaceCreateEventType } from '@/types';
import { getRequest, postRequest } from '@/utils/http';

export interface ICreateSpaceRequest {
  name: string;
  description?: string | null;
  userIds?: string[] | null;
}

export interface ICreateSpaceMatchRequest {
  matchId?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  startTime?: string;
  endTime?: string;
  maxReservedLiability: number;
}

export interface ISpaceMatch {
  id: string;
  spaceId: string;
  matchId: string;
  match?: IMatch;
  reservedLiability?: number;
  maxReservedLiability?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Minimal wizard state needed to POST /spaces/{spaceId}/matches.
 * Compatible with {@link ICreateSpaceEventState} from the create-event screen.
 */
export interface ICreateSpaceEventWizardSnapshot {
  selectEvent?: { id: string };
  risk?: { maxReservedLiability: number };
  configuration?: {
    homeTeam: string;
    awayTeam: string;
    startTime: string;
    endTime: string;
  };
}

export class SpaceService {
  public static buildCreateSpaceMatchRequest(
    eventType: TSpaceCreateEventType | undefined,
    allData: Partial<ICreateSpaceEventWizardSnapshot>
  ): ICreateSpaceMatchRequest {
    const maxReservedLiability = allData.risk?.maxReservedLiability;
    if (maxReservedLiability == null || maxReservedLiability <= 0) {
      throw new Error('Maximum reserved liability must be greater than zero.');
    }

    if (eventType === ESpaceCreateEventType.AUTO) {
      const matchId = allData.selectEvent?.id;
      if (!matchId) {
        throw new Error('Select a match to continue.');
      }
      return { matchId, maxReservedLiability };
    }

    const c = allData.configuration;
    if (
      !c?.homeTeam?.trim() ||
      !c?.awayTeam?.trim() ||
      !c?.startTime?.trim() ||
      !c?.endTime?.trim()
    ) {
      throw new Error('Complete event configuration (teams and times) before creating.');
    }

    return {
      homeTeamName: c.homeTeam.trim(),
      awayTeamName: c.awayTeam.trim(),
      startTime: c.startTime,
      endTime: c.endTime,
      maxReservedLiability,
    };
  }

  public static async findAllSpaces() {
    return await getRequest<ISpace[]>('/spaces');
  }

  public static async findSpaceById(spaceId: string) {
    return await getRequest<ISpace>(`/spaces/${spaceId}`);
  }

  public static async create(data: ICreateSpaceRequest) {
    return await postRequest<ISpace, ICreateSpaceRequest>('/spaces', data);
  }

  public static async createSpaceMatch(spaceId: string, data: ICreateSpaceMatchRequest) {
    return await postRequest<ISpaceMatch, ICreateSpaceMatchRequest>(
      `/spaces/${spaceId}/matches`,
      data
    );
  }
}
