import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AsyncProcessingGlobalSheetProps } from '../bottom-sheet/global-sheets/async-processing-gs';
import { ButtonProps } from '../button';

export interface IWizardButtonProps extends ButtonProps {
  visible?: boolean;
  label?: string;
}

/** Aggregated wizard state: optional values per key of `TState`. */
export type WizardAllData<TState extends object> = Partial<TState>;

export interface IWizardStep<TState extends object = object> {
  id: Extract<keyof TState, string>;
  title: string;
  canSkip?: boolean;
  defaultData?: unknown;
  /** If omitted, the step is always shown for the current `allData`. */
  visible?: (allData: WizardAllData<TState>) => boolean;
  defaultNextButtonProps?: IWizardButtonProps;
  defaultPreviousButtonProps?: IWizardButtonProps;
  setPrevious?: (buttonProps: IWizardButtonProps) => void;
  /** Step components narrow `data` / `allData`; keep `any` so concrete screens stay assignable. */
  component: React.ComponentType<WizardComponentProps<any, any>>;
}

export interface WizardComponentProps<TData = unknown, TAll extends object = object> {
  data: TData;
  allData: TAll;
  goPrevious: () => void;
  onChange: (data: TData) => void;
  goNext: () => void;
  runAsyncSubmit?: (props: AsyncProcessingGlobalSheetProps) => void;
  /** Zero-based index into the full `steps` array. No-op if out of range or target step is not visible. */
  jumpTo: (stepIndex: number) => void;
  setNext?: (buttonProps: IWizardButtonProps) => void;
  setPrevious?: (buttonProps: IWizardButtonProps) => void;
}

export function isStepVisible<TState extends object>(
  step: IWizardStep<TState>,
  allData: WizardAllData<TState>
): boolean {
  if (!step.visible) return true;
  return step.visible(allData);
}

function findFirstVisibleIndex<TState extends object>(
  steps: IWizardStep<TState>[],
  allData: WizardAllData<TState>
): number {
  for (let i = 0; i < steps.length; i++) {
    if (isStepVisible(steps[i], allData)) return i;
  }
  return 0;
}

function findNextVisibleIndex<TState extends object>(
  steps: IWizardStep<TState>[],
  fromIndex: number,
  allData: WizardAllData<TState>
): number | null {
  for (let i = fromIndex + 1; i < steps.length; i++) {
    if (isStepVisible(steps[i], allData)) return i;
  }
  return null;
}

function findPrevVisibleIndex<TState extends object>(
  steps: IWizardStep<TState>[],
  fromIndex: number,
  allData: WizardAllData<TState>
): number | null {
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (isStepVisible(steps[i], allData)) return i;
  }
  return null;
}

interface IWizardProps<TState extends object> {
  steps: IWizardStep<TState>[];
  /** Zero-based index into the full `steps` array; defaults to the first visible step. */
  activeStep?: number;
}

const getInitialAllData = <TState extends object>(
  steps: IWizardStep<TState>[]
): WizardAllData<TState> => {
  return steps.reduce((acc, step) => {
    (acc as Record<string, unknown>)[step.id] = step.defaultData ?? undefined;
    return acc;
  }, {} as WizardAllData<TState>);
};

export const useWizard = <TState extends object = object>({
  steps,
  activeStep: activeStepProp,
}: IWizardProps<TState>) => {
  const initialAllData = useMemo(() => getInitialAllData(steps), [steps]);

  const [allData, setAllData] = useState<WizardAllData<TState>>(initialAllData);
  const [activeStepIndex, setActiveStepIndex] = useState(() => {
    if (activeStepProp !== undefined) {
      const idx = Math.min(Math.max(0, activeStepProp), Math.max(0, steps.length - 1));
      if (steps[idx] && isStepVisible(steps[idx], initialAllData)) return idx;
      return findFirstVisibleIndex(steps, initialAllData);
    }
    return findFirstVisibleIndex(steps, initialAllData);
  });

  const goNext = useCallback(() => {
    if (steps.length === 0) return undefined;
    const nextIdx = findNextVisibleIndex(steps, activeStepIndex, allData);
    if (nextIdx === null) return undefined;
    setActiveStepIndex(nextIdx);
    return steps[nextIdx];
  }, [activeStepIndex, allData, steps]);

  const goPrevious = useCallback(() => {
    if (steps.length === 0) return undefined;
    const prevIdx = findPrevVisibleIndex(steps, activeStepIndex, allData);
    if (prevIdx === null) return undefined;
    setActiveStepIndex(prevIdx);
    return steps[prevIdx];
  }, [activeStepIndex, allData, steps]);

  const jumpTo = useCallback(
    (stepIndex: number) => {
      if (steps.length === 0) return undefined;
      if (stepIndex < 0 || stepIndex >= steps.length) return undefined;
      if (!isStepVisible(steps[stepIndex], allData)) return undefined;
      setActiveStepIndex(stepIndex);
      return steps[stepIndex];
    },
    [allData, steps]
  );

  const handleChange = useCallback(
    (data: unknown) => {
      const stepId = steps[activeStepIndex]?.id;
      if (stepId == null) return;
      setAllData(
        (prev) =>
          ({
            ...prev,
            [stepId]: data,
          }) as WizardAllData<TState>
      );
    },
    [activeStepIndex, steps]
  );

  const activeStepMeta = steps[activeStepIndex];
  const activeStepComponentProps: WizardComponentProps<unknown, WizardAllData<TState>> = {
    allData,
    goNext,
    onChange: handleChange,
    goPrevious,
    jumpTo,
    data: activeStepMeta ? (allData[activeStepMeta.id] as unknown) : undefined,
  };

  const resetStepData = useCallback(
    (stepId: string) => {
      const step = steps.find((step) => step.id === stepId);
      if (!step) return;

      setAllData((prev) => ({
        ...prev,
        [stepId]: step?.defaultData ?? undefined,
      }));
    },
    [steps]
  );

  const resetAllData = useCallback(() => {
    setAllData(getInitialAllData(steps));
  }, [initialAllData]);

  const activeStepComponent = useMemo(() => steps[activeStepIndex], [activeStepIndex, steps]);

  const isDirty = useMemo(
    () => JSON.stringify(allData) !== JSON.stringify(initialAllData),
    [allData, initialAllData]
  );

  // If the active step becomes non-visible after `allData` changes, move to the next visible
  // step forward, or if none, the previous visible step.
  useEffect(() => {
    if (steps.length === 0) return;
    setActiveStepIndex((idx) => {
      const i = Math.min(idx, steps.length - 1);
      if (steps[i] && isStepVisible(steps[i], allData)) return i;

      const next = findNextVisibleIndex(steps, i, allData);
      if (next !== null) return next;
      const prev = findPrevVisibleIndex(steps, i, allData);
      if (prev !== null) return prev;
      return i;
    });
  }, [allData, steps]);

  return {
    allData,

    /** True when any step data differs from the initial wizard snapshot. */
    isDirty,
    goNext,
    goPrevious,
    jumpTo,

    resetStepData,
    resetAllData,

    /** Zero-based index into the full `steps` array. */
    activeStepIndex,

    /** Human-facing step number (1-based) for the current slot in the full list. */
    activeStepNumber: activeStepIndex + 1,
    stepsCount: steps.length,
    activeStep: activeStepComponent,
    activeStepProps: activeStepComponentProps,
  };
};

export const WizardPrimaryActionContext = createContext<React.MutableRefObject<
  (() => void) | null
> | null>(null);

/**
 * Registers the latest primary footer action for the active step (validate + advance, submit, etc.).
 * Assigns during render so the parent footer always invokes the most recent handler without
 * re-running `setNext` on every `data` change.
 *
 * `WizardScreen` reads this from `WizardPrimaryActionContext` (a ref) on the Next button:
 * if `setNext` did not supply `onPress`, the footer calls this handler before falling back to `goNext`.
 */
export function useWizardPrimaryAction(handler: () => void) {
  const ref = useContext(WizardPrimaryActionContext);
  if (ref) {
    ref.current = handler;
  }
}
