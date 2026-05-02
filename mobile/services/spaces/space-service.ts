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

export interface IAllocateSpaceFundingRequest {
  memo?: string | null;
  amount: number;
}

export interface ISpaceMembership {
  isSpaceAdmin: boolean;
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

    const configuration = allData.configuration;
    if (
      !configuration ||
      !configuration?.homeTeam?.trim() ||
      !configuration?.awayTeam?.trim() ||
      !configuration?.startTime?.trim() ||
      !configuration?.endTime?.trim()
    ) {
      throw new Error('Complete event configuration (teams and times) before creating.');
    }

    return {
      homeTeamName: configuration.homeTeam.trim(),
      awayTeamName: configuration.awayTeam.trim(),
      startTime: configuration.startTime,
      endTime: configuration.endTime,
      maxReservedLiability,
    };
  }

  public static async findAllSpaces() {
    return await getRequest<ISpace[]>('/spaces');
  }

  public static async findSpaceById(spaceId: string) {
    return await getRequest<ISpace>(`/spaces/${spaceId}`);
  }

  /** Current user's membership in the space (`space_users.is_admin`). Requires auth. */
  public static async getMySpaceMembership(spaceId: string) {
    return await getRequest<ISpaceMembership>(`/spaces/${spaceId}/membership`);
  }

  public static async findSpaceMatches(spaceId: string) {
    return await getRequest<IMatch[]>(`/spaces/${spaceId}/matches`);
  }

  public static async create(data: ICreateSpaceRequest) {
    return await postRequest<ISpace, ICreateSpaceRequest>('/spaces', data);
  }

  public static async createSpaceMatch(spaceId: string, data: ICreateSpaceMatchRequest) {
    return await postRequest<IMatch, ICreateSpaceMatchRequest>(`/spaces/${spaceId}/matches`, data);
  }

  public static async allocateFunding(spaceId: string, data: IAllocateSpaceFundingRequest) {
    return await postRequest<void, IAllocateSpaceFundingRequest>(`/spaces/${spaceId}/fund`, data);
  }
}
