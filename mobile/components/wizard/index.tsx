import React, { useEffect, useState } from 'react';
import { Wizard as WizardComponent, WizardStepProps, WizardStepStates } from 'react-native-ui-lib';
import { Image, StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Add } from '../icons';

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
        circleColor: '#485164',
        connectorStyle: {
          borderColor: 'red',
        },
      };
    case WizardStepStates.DISABLED:
      return {
        circleColor: '#61687E',
        connectorStyle: {
          borderColor: '#61687E',
        },
        indexLabelStyle: {
          color: 'white',
        },
        color: styles?.disabledStyle?.color ?? '#61687E',
        labelStyle: styles?.disabledStyle?.labelStyle,
        circleBackgroundColor: styles?.disabledStyle?.circleBackgroundColor ?? '#61687E',
      };
    default:
      return {
        labelStyle: styles?.disabledStyle?.labelStyle,
        circleColor: styles?.disabledStyle?.circleColor ?? '#61687E',
        circleBackgroundColor: styles?.disabledStyle?.circleBackgroundColor ?? '#61687E',
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

const Wizard = ({ activeIndex, steps, onStepChange, activeStyle, disabledStyle }: WizardProps) => {
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
        color: activeStyle?.color ?? '#F3CA41',
        circleColor: activeStyle?.circleColor ?? '#F3CA41',
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
    color: '#F3CA41',
    fontWeight: '600',
  },
});

export default Wizard;
