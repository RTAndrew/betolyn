import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Wizard as WizardComponent, WizardStepProps, WizardStepStates } from 'react-native-ui-lib';

import { colors } from '@/constants/colors';

interface IWizardStep {
  label: string;
  state?: `${WizardStepStates}`;
}

interface IStyleConfig {
  circleColor?: string;
  circleBackgroundColor?: string;
  color?: string;
  labelStyle?: StyleProp<TextStyle>;
}

interface WizardProps {
  activeIndex?: number;
  steps: IWizardStep[];
  onStepChange?: (step: number) => void;
  activeStyle?: IStyleConfig;
  disabledStyle?: IStyleConfig;
}

const getStyleConfig = (
  state: `${WizardStepStates}`,
  styles?: Pick<WizardProps, 'activeStyle' | 'disabledStyle'>
): Omit<WizardStepProps, 'state'> => {
  switch (state) {
    case WizardStepStates.ENABLED:
      return {
        labelStyle: styles?.activeStyle?.labelStyle,
        color: styles?.activeStyle?.color ?? 'white',
        circleColor: colors.greyMedium,
        connectorStyle: {
          borderColor: 'red',
        },
      };
    case WizardStepStates.DISABLED:
      return {
        circleColor: colors.greyLight,
        connectorStyle: {
          borderColor: colors.greyLight,
        },
        indexLabelStyle: {
          color: colors.white,
        },
        color: styles?.disabledStyle?.color ?? colors.greyLight,
        labelStyle: styles?.disabledStyle?.labelStyle,
        circleBackgroundColor: styles?.disabledStyle?.circleBackgroundColor ?? colors.greyLight,
      };
    default:
      return {
        labelStyle: styles?.disabledStyle?.labelStyle,
        circleColor: styles?.disabledStyle?.circleColor ?? colors.greyLight,
        circleBackgroundColor: styles?.disabledStyle?.circleBackgroundColor ?? colors.greyLight,
      };
  }
};

const getStepState = (
  activeIndex: number,
  idx: number,
  state?: `${WizardStepStates}`
): `${WizardStepStates}` => {
  if (state) return state;

  return activeIndex === idx ? WizardStepStates.ENABLED : WizardStepStates.DISABLED;
};

const Wizard = ({
  activeIndex,
  steps,
  onStepChange: _onStepChange,
  activeStyle,
  disabledStyle,
}: WizardProps) => {
  const [activeIndexState, setActiveIndexState] = useState(activeIndex ?? 0);

  useEffect(() => {
    setActiveIndexState(activeIndex ?? 0);
  }, [activeIndex]);

  return (
    <WizardComponent
      onActiveIndexChanged={setActiveIndexState}
      activeConfig={{
        state: WizardStepStates.ENABLED,
        labelStyle: styles.activeLabel,
        color: activeStyle?.color ?? colors.complementary,
        circleColor: activeStyle?.circleColor ?? colors.complementary,
        connectorStyle: {
          height: 1,
          backgroundColor: 'red',
        },
      }}
      containerStyle={styles.wizardContainer}
      activeIndex={activeIndexState}
    >
      {steps.map((step, idx) => {
        const state = getStepState(activeIndexState, idx, step.state);

        return (
          <WizardComponent.Step
            state={state}
            key={step.label}
            label={step.label}
            {...getStyleConfig(state, { activeStyle, disabledStyle })}
          />
        );
      })}
    </WizardComponent>
  );
};

const styles = StyleSheet.create({
  wizardContainer: {
    marginTop: 0,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingBottom: 24,

    // reset all styles
    paddingHorizontal: 0,
    borderBottomWidth: 0,
    boxShadow: 'none',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  activeLabel: {
    color: colors.complementary,
    fontWeight: '600',
  },
});

export default Wizard;
