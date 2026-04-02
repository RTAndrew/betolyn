import React from 'react';

import { IWizardStep } from '@/components/wizard/use-wizard';
import { WizardScreen } from '@/components/wizard/wizard-screen';

import type { ISpaceAllocateState } from './utils';

import { AllocateAmountStep } from './allocate-amount-step';
import { AllocateReviewStep } from './allocate-review-step';

const AllocateFundsScreen = () => {
  const steps: IWizardStep<ISpaceAllocateState>[] = [
    {
      id: 'allocation',
      title: 'Allocate Funds',
      defaultData: { amount: 0, memo: '' },
      component: AllocateAmountStep,
      defaultPreviousButtonProps: { visible: false },
    },
    {
      id: 'review',
      title: 'Review',
      component: AllocateReviewStep,
      defaultData: {},
      defaultNextButtonProps: { label: 'Finish' },
    },
  ];

  return <WizardScreen steps={steps} activeStep={0} />;
};

export default AllocateFundsScreen;
