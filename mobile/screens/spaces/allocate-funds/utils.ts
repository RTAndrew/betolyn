import { WizardComponentProps } from '@/components/wizard/use-wizard';

export interface ISpaceAllocateAllocation {
  amount: number;
  memo?: string;
}

export interface ISpaceAllocateState {
  allocation?: ISpaceAllocateAllocation;
  review?: Record<string, never>;
}

export type SpaceAllocateWizardStepId = keyof ISpaceAllocateState;

export type SpaceAllocateWizardStepProps<
  TStep extends SpaceAllocateWizardStepId = SpaceAllocateWizardStepId,
> = WizardComponentProps<ISpaceAllocateState[TStep], ISpaceAllocateState>;
