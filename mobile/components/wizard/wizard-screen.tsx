import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import ScreenHeader from '@/components/screen-header';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';

import { AsyncProcessingGlobalSheetProps } from '../bottom-sheet/global-sheets/async-processing-gs';
import { Button } from '../button';
import SafeHorizontalView from '../safe-horizontal-view';
import { SegmentedProgressBar } from '../segmented-progress-bar';
import {
  IWizardButtonProps,
  IWizardStep,
  useWizard,
  WizardPrimaryActionContext,
} from './use-wizard';

interface WizardScreenProps<TState extends object = object> {
  steps: IWizardStep<TState>[];
  /** Zero-based index into the full `steps` array; defaults to first visible step. */
  activeStep?: number;
  defaultNextButtonProps?: IWizardButtonProps;
  defaultPreviousButtonProps?: IWizardButtonProps;
}

const DEFAULT_NEXT_BUTTON_PROPS: IWizardButtonProps = {
  label: 'Next',
  visible: true,
};

const DEFAULT_PREVIOUS_BUTTON_PROPS: IWizardButtonProps = {
  visible: true,
  variant: 'text',
  label: 'Previous',
};

export const WizardScreen = <TState extends object>({
  steps,
  activeStep: activeStepProp = 0,
  defaultNextButtonProps = DEFAULT_NEXT_BUTTON_PROPS,
  defaultPreviousButtonProps = DEFAULT_PREVIOUS_BUTTON_PROPS,
}: WizardScreenProps<TState>) => {
  const [nextButtonProps, setNextButtonProps] = useState<IWizardButtonProps | null>(null);
  const [previousButtonProps, setPreviousButtonProps] = useState<IWizardButtonProps | null>(null);
  const primaryActionRef = useRef<(() => void) | null>(null);

  const navigation = useNavigation();

  const {
    goNext,
    goPrevious,
    resetAllData,
    jumpTo,
    activeStepIndex,
    activeStepNumber,
    activeStep,
    activeStepProps: activeStepComponentProps,
    isDirty,
  } = useWizard({
    steps,
    activeStep: activeStepProp,
  });

  usePreventRemove(isDirty, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. If you leave now, they will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

  const syncFooterToStep = useCallback(
    (step: (typeof steps)[number] | undefined) => {
      if (!step) return;
      setNextButtonProps(step.defaultNextButtonProps ?? defaultNextButtonProps);
      setPreviousButtonProps(step.defaultPreviousButtonProps ?? defaultPreviousButtonProps);
    },
    [defaultNextButtonProps, defaultPreviousButtonProps]
  );

  const handleGoNext = useCallback(() => {
    const step = goNext();
    syncFooterToStep(step);
    return step;
  }, [goNext, syncFooterToStep]);

  const handleGoPrevious = useCallback(() => {
    const step = goPrevious();
    syncFooterToStep(step);
    return step;
  }, [goPrevious, syncFooterToStep]);

  const handleJumpTo = useCallback(
    (stepIndex: number) => {
      const step = jumpTo(stepIndex);
      syncFooterToStep(step);
    },
    [jumpTo, syncFooterToStep]
  );

  const runAsyncSubmit = useCallback(
    ({
      errorTitle,
      loadingTitle,
      successTitle,
      successMessage,
      onSuccessClose,
      fnPromise,
    }: AsyncProcessingGlobalSheetProps) => {
      SheetManager.show('asyncProcessing', {
        payload: {
          successTitle,
          loadingTitle,
          errorTitle,
          successMessage,
          fnPromise,
          onSuccessClose: (fnResult) => {
            resetAllData(); // reset all data so the the screens can be closed
            router.dismissTo('/spaces');
            SheetManager.hide('asyncProcessing');
            onSuccessClose?.(fnResult);
          },
        },
      });
    },
    []
  );

  const ActiveStepComponent = activeStep.component;

  const { onPress: nextOnPressFromProps, ...nextButtonRest } = nextButtonProps ?? {};
  const { onPress: prevOnPressFromProps, ...previousButtonRest } = previousButtonProps ?? {};

  const completedSegment = activeStepIndex + 1;
  const remainingSegment = Math.max(0, steps.length - completedSegment);

  return (
    <WizardPrimaryActionContext.Provider value={primaryActionRef}>
      <View style={{ flex: 1, backgroundColor: colors.greyLight }}>
        <ScreenHeader
          onClose={() => router.back()}
          iconContainerColor={colors.greyMedium}
          title={
            <View style={{ width: '100%' }}>
              <SegmentedProgressBar
                height={5}
                segments={[
                  { value: completedSegment, color: colors.greyLighter },
                  { value: remainingSegment, color: colors.greyLighter50 },
                ]}
              />
            </View>
          }
        />

        <View style={styles.body}>
          <SafeHorizontalView>
            <ThemedText style={styles.stepDescription}>
              Step {activeStepNumber} of {steps.length}
            </ThemedText>
            <ThemedText style={styles.title} type="title">
              {activeStep.title}
            </ThemedText>
          </SafeHorizontalView>

          <ActiveStepComponent
            onChange={activeStepComponentProps.onChange}
            data={activeStepComponentProps.data}
            allData={activeStepComponentProps.allData}
            runAsyncSubmit={runAsyncSubmit}
            setNext={setNextButtonProps}
            setPrevious={setPreviousButtonProps}
            goPrevious={handleGoPrevious}
            goNext={handleGoNext}
            jumpTo={handleJumpTo}
          />

          <SafeHorizontalView style={styles.floatingActionButton}>
            {previousButtonProps?.visible && (
              <Button.Root
                {...previousButtonRest}
                onPress={(e) => {
                  if (prevOnPressFromProps) {
                    prevOnPressFromProps(e);
                    return;
                  }
                  handleGoPrevious();
                }}
                style={StyleSheet.flatten([styles.button])}
              >
                {previousButtonProps?.label}
              </Button.Root>
            )}

            {(nextButtonProps?.visible ?? true) && (
              <Button.Root
                {...nextButtonRest}
                onPress={(e) => {
                  if (nextOnPressFromProps) {
                    nextOnPressFromProps(e);
                    return;
                  }
                  const primary = primaryActionRef.current;
                  if (primary) {
                    primary();
                    return;
                  }
                  handleGoNext();
                }}
                style={StyleSheet.flatten([styles.button, nextButtonRest?.style])}
              >
                {nextButtonProps?.label ?? defaultNextButtonProps.label}
              </Button.Root>
            )}
          </SafeHorizontalView>
        </View>
      </View>
    </WizardPrimaryActionContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyLight,
  },
  body: {
    flex: 1,
    paddingTop: 16,
    marginTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.greyMedium,
  },
  stepDescription: {
    fontWeight: '500',
    color: colors.greyLighter50,
  },
  title: {
    marginBottom: 16,
  },
  floatingActionButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    position: 'absolute',
    bottom: 60,
    right: 0,
    left: 0,
    flex: 1,
  },
  button: {
    flex: 1,
    maxWidth: '48%',
  },
});
