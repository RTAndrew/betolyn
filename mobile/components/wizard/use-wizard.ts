import { useCallback, useMemo, useState } from 'react';

import { ButtonProps } from '../button';

export interface IWizardButtonProps extends ButtonProps {
  visible?: boolean;
  label?: string;
}

type Keys = string;
type TAllData<TKeys extends Keys, TData> = {
  [key in TKeys]: TData | undefined;
};

export interface IWizardStep<TKeys = Keys, TData = unknown> {
  id: TKeys;
  title: string;
  defaultData?: TData;
  defaultNextButtonProps?: IWizardButtonProps;
  defaultPreviousButtonProps?: IWizardButtonProps;
  setPrevious?: (buttonProps: IWizardButtonProps) => void;

  // using unknown does not work as expected
  // so, using any here so concrete screens can register safely
  component: React.ComponentType<WizardComponentProps<any, any>>;
}

type TWizardAction = { toStep?: number };

export interface WizardComponentProps<TData = unknown, TAllData = unknown> {
  data: TData;
  allData: TAllData;
  onPrevious: () => void;
  onChange: (data: TData) => void;
  onNext: (payload?: TWizardAction) => void;
  setNext?: (buttonProps: IWizardButtonProps) => void;
  setPrevious?: (buttonProps: IWizardButtonProps) => void;
}

interface IWizardProps<TKeys extends Keys, TData = unknown> {
  steps: IWizardStep<TKeys, TData>[];
  activeStep?: number;
}

export const useWizard = <TKeys extends Keys, TData = unknown>({
  steps,
  activeStep: activeStepProp,
}: IWizardProps<TKeys, TData>) => {
  const [activeStep, setActiveStep] = useState(activeStepProp ?? 1);
  const [allData, setAllData] = useState(
    steps.reduce(
      (acc, step) => {
        acc[step.id as TKeys] = step.defaultData ?? undefined;
        return acc;
      },
      {} as TAllData<TKeys, TData>
    )
  );

  const handleNext = useCallback(
    (payload?: TWizardAction) => {
      if (activeStep === steps.length) return;
      const nextStep = payload?.toStep ?? activeStep + 1;
      setActiveStep(nextStep);
      return steps[nextStep - 1];
    },
    [activeStep, steps]
  );

  const handlePrevious = useCallback(() => {
    if (activeStep === 1) return;
    const previousStep = activeStep - 1;

    setActiveStep(previousStep);
    return steps[previousStep - 1];
  }, [activeStep, steps]);

  const handleChange = useCallback(
    (data: any) => {
      const stepId = steps[activeStep - 1]?.id;
      if (stepId == null) return;
      setAllData((prev) => ({ ...prev, [stepId]: data }));
    },
    [activeStep, steps]
  );

  const activeStepComponentProps: WizardComponentProps<any, any> = {
    allData,
    onNext: handleNext,
    onChange: handleChange,
    onPrevious: handlePrevious,
    data: allData[steps[activeStep - 1].id as TKeys],
  };

  const activeStepComponent = useMemo(() => steps[activeStep - 1], [activeStep, steps]);

  return {
    allData,

    onNext: handleNext,
    onPrevious: handlePrevious,

    activeIndex: activeStep,
    stepsCount: steps.length,
    activeStep: activeStepComponent,
    activeStepProps: activeStepComponentProps,
  };
};
