export interface IUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

/** User shape in nested API payloads (e.g. `createdBy`) — subset of {@link IUser}. */
export type IUserPublic = Pick<IUser, 'id' | 'email' | 'username'>;

export interface ITeam {
  id: string;
  name: string;
  badgeUrl: string;
  /** Present when API returns it: feed-synced teams vs custom event teams. */
  isOfficial?: boolean;
}

export interface ISpace {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: IUserPublic;
}

export type TMatchType = 'OFFICIAL' | 'CUSTOM' | 'DERIVED';

export interface IMatch {
  id: string;
  type?: TMatchType;
  officialMatchId?: string | null;
  spaceId?: string | null;
  homeTeam: ITeam;
  awayTeam: ITeam;
  homeTeamScore: number;
  awayTeamScore: number;
  startTime: string;
  endTime: string | null;
  createdBy: IUserPublic;
  status?: `${MatchStatusEnum}`;
  mainCriterion?: ICriterion & { odds: IOdd[] };
}

export interface ICriterion {
  id: string;
  name: string;
  match: IMatch;
  isStandalone: boolean;
  allowMultipleOdds: boolean;
  allowMultipleWinners: boolean;

  totalBetsCount: number;
  totalStakesVolume: number;
  reservedLiability: number;
  maxReservedLiability?: number;

  status: `${CriterionStatusEnum}`;
}

export interface ICriterionMetrics {
  criterionName: string;
  reservedLiability: number;
  maxReservedLiability: number | null;
  riskLevel: number | null;
  totalBetsCount: number;
  totalStakesVolume: number;
  profitAndLosses: number | null;
}

export interface IMatchMetrics {
  totalVolume: number;
  reservedLiability: number;
  maxReservedLiability: number | null;
  riskLevel: number;
  totalCriteriaCount: number;
  totalBetCount: number;
  profitAndLosses: number | null;
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

/** Space "create event" wizard route / flow: pick existing match vs custom teams. */
export enum ESpaceCreateEventType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export type TSpaceCreateEventType = `${ESpaceCreateEventType}`;

export interface IOdd {
  id: string;
  name: string;
  value: number;
  matchId: string;
  isWinner?: boolean;
  status: `${EOddStatus}`;
  direction?: 'UP' | 'DOWN';
  totalBetsCount: number;
  totalStakesVolume: number;
  potentialPayoutVolume: number;
}

export interface IOddMetrics {
  odd: IOdd & { criterion: Omit<ICriterion, 'match'> };
  totalCriterionVolume: number;
  totalOddVolume: number;
  marketShare: number;
  profitAndLosses: number | null;
  averageStake: number;
  totalBetsCount: number;
}

export type EBetSlipType = 'SINGLE' | 'PARLAY';

export interface IBetSlip {
  id: string;
  status: string;
  items: IBetSlipItem[];
  totalStake: number;
  type: `${EBetSlipType}`;
  totalItemsCount: number;
  totalPotentialPayout: number;
  totalCumulativeOdds?: number;
}

export type IBetSlipItemStatus = 'PENDING' | 'LOST' | 'WON' | 'VOIDED';

export interface IBetSlipItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  oddId: string;
  stake: number;
  status: `${IBetSlipItemStatus}`;
  matchId: string;
  match?: IMatch;
  criterionId: string;
  lastOddHistoryId: string;
  potentialPayout: number;
  voidReason: string | null;
  oddValueAtPlacement: number;
}

/** Ledger transaction type (bankroll). */
export type TTransactionType =
  | 'TRANSFER'
  | 'CHANNEL_FUNDING'
  | 'MINT_CREDITS'
  | 'BET_PLACEMENT'
  | 'MATCH_SETTLEMENT'
  | 'MARKET_VOID'
  | 'MATCH_VOID'
  | 'VOID_REVERSAL'
  | 'PLATFORM_FEE_COLLECTION'
  | 'CHANNEL_WITHDRAW';

export type TTransactionReferenceType = 'BET_SLIP' | 'MATCH' | 'MARKET' | 'CHANNEL' | 'USER';

/** Account leg in a transaction line item. Mirrors backend `AccountTypeEnum`. */
export type TAccountType =
  | 'USER_WALLET'
  | 'SPACE_AVAILABLE'
  | 'SPACE_RESERVED'
  | 'GLOBAL'
  | 'GLOBAL_ESCROW';

/** Line item kind within a transaction. Mirrors backend `TransactionItemTypeEnum`. */
export type TTransactionItemType =
  | 'STAKE_ESCROW'
  | 'LIABILITY_RESERVE'
  | 'WIN_PAYOUT_STAKE'
  | 'WIN_PAYOUT_PROFIT'
  | 'LOSS_COLLECTION'
  | 'RESERVE_RELEASE';

export interface ITransactionItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  referenceMatchId: string | null;
  referenceBetSlipId: string | null;
  type: `${TTransactionItemType}`;
  fromAccountId: string;
  fromAccountType: `${TAccountType}`;
  toAccountId: string;
  toAccountType: `${TAccountType}`;
  amount: number;
}

export interface ITransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  memo: string | null;
  totalAmount: number;
  type: `${TTransactionType}`;
  referenceId: string;
  referenceType: `${TTransactionReferenceType}`;
  createdBy?: IUserPublic;
  items: ITransactionItem[];
}
