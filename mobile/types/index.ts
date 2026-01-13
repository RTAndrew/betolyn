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

export interface IOdd {
  id: number;
  name: string;
  value: number;
  status: `${EOddStatus}`;
}