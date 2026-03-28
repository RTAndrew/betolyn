import React, { useMemo } from 'react';

import { IWizardStep } from '@/components/wizard/use-wizard';
import { WizardScreen } from '@/components/wizard/wizard-screen';

import { CreateEventReviewStep } from './create-event-review-step';
import { EventConfigurationStep } from './event-configuration-step';
import { RiskManagementStep } from './risk-management-step';
import { SelectEventStep } from './select-event-step';
import { ESpaceCreateEventType, ICreateSpaceEventState } from './utils';

interface CreateEventScreenProps {
  type: `${ESpaceCreateEventType}`;
}

const CreateEventScreen = ({ type }: CreateEventScreenProps) => {
  const steps = useMemo(() => {
    const manualOnly: IWizardStep<ICreateSpaceEventState>[] = [
      {
        id: 'configuration',
        title: 'Event Configuration',
        component: EventConfigurationStep,
        defaultPreviousButtonProps: { visible: false },
      },
      {
        id: 'risk',
        title: 'Risk Management',
        component: RiskManagementStep,
      },
      {
        id: 'review',
        title: 'Create event',
        component: CreateEventReviewStep,
      },
    ];

    const auto: IWizardStep<ICreateSpaceEventState>[] = [
      {
        id: 'selectEvent',
        title: 'Select available events',
        component: SelectEventStep,
        defaultPreviousButtonProps: { visible: false },
        defaultNextButtonProps: { visible: false },
      },
      {
        id: 'risk',
        title: 'Risk Management',
        component: RiskManagementStep,
      },
      {
        id: 'review',
        title: 'Create event',
        component: CreateEventReviewStep,
      },
    ];

    if (type === ESpaceCreateEventType.MANUAL) {
      return manualOnly;
    }

    return auto;
  }, [type]);
  return <WizardScreen steps={steps} activeStep={0} />;
};

export default CreateEventScreen;
