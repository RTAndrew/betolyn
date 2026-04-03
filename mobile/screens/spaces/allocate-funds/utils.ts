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

export function formatKwanzaAmount(amount = 0): string {
  if (amount === 0) return '0.00';

  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
