import { WizardComponentProps } from '@/components/wizard/use-wizard';
import { IMatch } from '@/types';

export type { TSpaceCreateEventType } from '@/types';
export { ESpaceCreateEventType } from '@/types';

export type CreateSpaceEventWizardStepId = 'selectEvent' | 'configuration' | 'risk' | 'review';

export interface IEventConfigurationFormData {
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  endTime: string;
}

export interface ICreateSpaceEventState {
  review?: undefined;
  selectEvent?: IMatch;
  risk?: { maxReservedLiability: number };
  configuration?: IEventConfigurationFormData;
}

export type CreateSpaceEventWizardStepProps<
  TStep extends CreateSpaceEventWizardStepId = CreateSpaceEventWizardStepId,
> = WizardComponentProps<ICreateSpaceEventState[TStep], ICreateSpaceEventState>;
