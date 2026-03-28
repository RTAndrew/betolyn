import React from 'react';

import { IWizardStep } from '@/components/wizard/use-wizard';
import { WizardScreen } from '@/components/wizard/wizard-screen';

import type { ICreateSpaceState } from './utils';

import { InvitePeople } from './invite-people';
import { SpaceConfiguration } from './space-configuration';

const CreateSpaceScreen = () => {
  const steps: IWizardStep<ICreateSpaceState>[] = [
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
      defaultData: { name: '', description: '' },
      defaultNextButtonProps: { label: 'Create Space' },
    },
  ];

  return <WizardScreen steps={steps} activeStep={0} />;
};

export default CreateSpaceScreen;
