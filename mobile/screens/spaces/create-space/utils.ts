import { WizardComponentProps } from '@/components/wizard/use-wizard';
import { IUserPublic } from '@/types';

export enum ECreateSpaceWizardStepKeys {
  INVITATION = 'invitation',
  CONFIGURATION = 'configuration',
}

export interface SpaceConfigurationFormData {
  name: string;
  description: string;
}

export interface ICreateSpaceState {
  invitation?: IUserPublic[];
  configuration?: SpaceConfigurationFormData;
}

export type CreateSpaceWizardStepId = keyof ICreateSpaceState;

export type CreateSpaceWizardStepProps<
  TStep extends CreateSpaceWizardStepId = CreateSpaceWizardStepId,
> = WizardComponentProps<ICreateSpaceState[TStep], ICreateSpaceState>;
