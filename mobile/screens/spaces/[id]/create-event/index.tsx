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
        title: 'Configuração do evento',
        component: EventConfigurationStep,
        defaultPreviousButtonProps: { visible: false },
      },
      {
        id: 'risk',
        title: 'Gestão de risco',
        component: RiskManagementStep,
      },
      {
        id: 'review',
        title: 'Criar evento',
        component: CreateEventReviewStep,
      },
    ];

    const auto: IWizardStep<ICreateSpaceEventState>[] = [
      {
        id: 'selectEvent',
        title: 'Selecionar eventos disponíveis',
        component: SelectEventStep,
        defaultPreviousButtonProps: { visible: false },
        defaultNextButtonProps: { visible: false },
      },
      {
        id: 'risk',
        title: 'Gestão de risco',
        component: RiskManagementStep,
      },
      {
        id: 'review',
        title: 'Criar evento',
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
