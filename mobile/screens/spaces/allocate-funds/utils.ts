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

/** Stub until a bankroll API returns the user’s available balance. */
export const STUB_PERSONAL_BALANCE_KZ = 5000;

export function formatKwanzaAmount(amount: number): string {
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
