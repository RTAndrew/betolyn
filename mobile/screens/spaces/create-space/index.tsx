import React from 'react';

import { IWizardStep } from '@/components/wizard/use-wizard';
import { WizardScreen } from '@/components/wizard/wizard-screen';

import { InvitePeople } from './invite-people';
import { SpaceConfiguration } from './space-configuration';
import { CreateSpaceWizardStepId } from './utils';

const CreateSpaceScreen = () => {
  const steps: IWizardStep<CreateSpaceWizardStepId>[] = [
    {
      id: 'invitation',
      title: 'Invite People',
      defaultData: [],
      component: InvitePeople,
      defaultPreviousButtonProps: { visible: false },
    },
    {
      id: 'configuration',
      title: 'Configuration',
      component: SpaceConfiguration,
      defaultData: { name: undefined, description: undefined },
      defaultNextButtonProps: { label: 'Create Space' },
    },
  ];

  return <WizardScreen steps={steps} activeStep={1} />;
};

export default CreateSpaceScreen;
