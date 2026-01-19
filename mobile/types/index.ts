export interface IUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeam {
  id: number;
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
  mainCriterion?: ICriteria & { odds: IOdd[] };
}

export interface ICriteria {
  id: number;
  name: string;
  match: IMatch;
  isStandalone: boolean;
  allowMultipleOdds: boolean;
}

enum EOddStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum CriterionStatusEnum {
  SUSPENDED = 'SUSPENDED',
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
  VOID = 'VOID',
}

export interface IOdd {
  id: string;
  name: string;
  value: number;
  status: `${EOddStatus}`;
}