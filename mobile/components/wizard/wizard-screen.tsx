import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenHeader from '@/components/screen-header';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';

import { Button } from '../button';
import SafeHorizontalView from '../safe-horizontal-view';
import { SegmentedProgressBar } from '../segmented-progress-bar';
import { IWizardButtonProps, IWizardStep, useWizard } from './use-wizard';

interface WizardScreenProps {
  steps: IWizardStep[];
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

export const WizardScreen = ({
  steps,
  activeStep: activeStepProp = 1,
  defaultNextButtonProps = DEFAULT_NEXT_BUTTON_PROPS,
  defaultPreviousButtonProps = DEFAULT_PREVIOUS_BUTTON_PROPS,
}: WizardScreenProps) => {
  const [nextButtonProps, setNextButtonProps] = useState<IWizardButtonProps | null>(null);
  const [previousButtonProps, setPreviousButtonProps] = useState<IWizardButtonProps | null>(null);

  const {
    onNext,
    onPrevious,
    activeIndex,
    activeStep,
    activeStepProps: activeStepComponentProps,
  } = useWizard({
    steps,
    activeStep: activeStepProp,
  });

  const handleNext: typeof onNext = (payload) => {
    const step = onNext(payload);
    if (!step) return;

    setNextButtonProps(step?.defaultNextButtonProps ?? defaultNextButtonProps);
    setPreviousButtonProps(step?.defaultPreviousButtonProps ?? defaultPreviousButtonProps);
    return step;
  };

  const handlePrevious: typeof onPrevious = () => {
    const step = onPrevious();

    if (!step) return;
    setNextButtonProps(step?.defaultNextButtonProps ?? defaultNextButtonProps);
    setPreviousButtonProps(step?.defaultPreviousButtonProps ?? defaultPreviousButtonProps);
    return step;
  };

  const ActiveStepComponent = activeStep.component;

  return (
    <View style={{ flex: 1, backgroundColor: colors.greyLight }}>
      <ScreenHeader
        onClose={() => router.back()}
        iconContainerColor={colors.greyMedium}
        title={
          <View style={{ width: '100%' }}>
            <SegmentedProgressBar
              height={5}
              segments={[
                { value: activeIndex, color: colors.greyLighter },
                { value: steps.length - activeIndex, color: colors.greyLighter50 },
              ]}
            />
          </View>
        }
      />

      <View style={styles.body}>
        <SafeHorizontalView>
          <ThemedText style={styles.stepDescription}>
            Step {activeIndex} of {steps.length}
          </ThemedText>
          <ThemedText style={styles.title} type="title">
            {activeStep.title}
          </ThemedText>
        </SafeHorizontalView>

        <ActiveStepComponent
          onChange={activeStepComponentProps.onChange}
          data={activeStepComponentProps.data}
          allData={activeStepComponentProps.allData}
          setNext={setNextButtonProps}
          setPrevious={setPreviousButtonProps}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <SafeHorizontalView style={styles.floatingActionButton}>
          {previousButtonProps?.visible && (
            <Button.Root
              {...previousButtonProps}
              onPress={(e) => previousButtonProps?.onPress?.(e) ?? handlePrevious()}
              style={StyleSheet.flatten([styles.button])}
            >
              {previousButtonProps?.label}
            </Button.Root>
          )}

          <Button.Root
            {...nextButtonProps}
            onPress={(e) => nextButtonProps?.onPress?.(e) ?? handleNext()}
            style={StyleSheet.flatten([styles.button, nextButtonProps?.style])}
          >
            {nextButtonProps?.label ?? defaultNextButtonProps.label}
          </Button.Root>
        </SafeHorizontalView>
      </View>
    </View>
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
