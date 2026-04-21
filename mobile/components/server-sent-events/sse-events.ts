/** Wire values for SSE envelopes — keep in sync with backend *SseEvent types. */

export const SseDomain = {
  odd: 'odd',
  criterion: 'criterion',
  match: 'match',
  team: 'team',
  user: 'user',
} as const;

export type TSseDomain = (typeof SseDomain)[keyof typeof SseDomain];

export const OddSseEventName = {
  oddStatusChanged: 'oddStatusChanged',
  oddValueChanged: 'oddValueChanged',
  oddCreated: 'oddCreated',
  oddUpdated: 'oddUpdated',
} as const;

export type TOddSseEventName = (typeof OddSseEventName)[keyof typeof OddSseEventName];

export const CriterionSseEventName = {
  criterionVoided: 'criterionVoided',
  criterionCreated: 'criterionCreated',
  refreshRequired: 'REFRESH_REQUIRED',
  criterionStatusChanged: 'criterionStatusChanged',
  criterionSuspended: 'criterionSuspended',
  criterionUpdated: 'criterionUpdated',
  criterionPublished: 'criterionPublished',
} as const;

export type TCriterionSseEventName =
  (typeof CriterionSseEventName)[keyof typeof CriterionSseEventName];

export const MatchSseEventName = {
  matchVoided: 'matchVoided',
  matchProgressChanged: 'matchProgressChanged',
  matchCreated: 'matchCreated',
  scoreChanged: 'scoreChanged',
  rescheduled: 'rescheduled',
} as const;

export type TMatchSseEventName = (typeof MatchSseEventName)[keyof typeof MatchSseEventName];

export const TeamSseEventName = {
  teamCreated: 'teamCreated',
  teamUpdated: 'teamUpdated',
} as const;

export type TTeamSseEventName = (typeof TeamSseEventName)[keyof typeof TeamSseEventName];

export const UserSseEventName = {
  userCreated: 'userCreated',
  userUpdated: 'userUpdated',
} as const;

export type TUserSseEventName = (typeof UserSseEventName)[keyof typeof UserSseEventName];
