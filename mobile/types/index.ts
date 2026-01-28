export interface IUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeam {
  id: string;
  name: string;
  badgeUrl: string;
}

export interface IMatch {
  id: string;
  homeTeam: ITeam;
  awayTeam: ITeam;
  homeTeamScore: number;
  awayTeamScore: number;
  startTime: string;
  endTime: string | null;
  createdBy: string;
  mainCriterion?: ICriterion & { odds: IOdd[] };
}

export interface ICriterion {
  id: string;
  name: string;
  match: IMatch;
  isStandalone: boolean;
  allowMultipleOdds: boolean;
  status: `${CriterionStatusEnum}`;
}

export enum MatchStatusEnum {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum EOddStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT',
  SUSPENDED = 'SUSPENDED',
  VOID = 'VOID',
  SETTLED = 'SETTLED',
}

export enum CriterionStatusEnum {
  SUSPENDED = 'SUSPENDED',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
  VOID = 'VOID',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT',
}

export interface IOdd {
  id: string;
  name: string;
  value: number;
  status: `${EOddStatus}`;
  direction?: 'UP' | 'DOWN';
}