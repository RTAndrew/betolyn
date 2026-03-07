import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { Add, Subtract } from '@/components/icons';
import { colors } from '@/constants/colors';

import BaseField, { BaseFieldProps } from '../base-field';
import TextInput from '../text-input';

const roundToTwoDecimals = (n: number) => Math.round(n * 100) / 100;

/** Keeps only digits and at most one dot, with up to 2 decimal places. */
function filterDecimalInput(str: string): string {
  let hasDot = false;
  let result = '';

  for (const c of str) {
    if (c >= '0' && c <= '9') result += c;
    else if (c === '.' && !hasDot) {
      hasDot = true;
      result += c;
    }
  }

  if (hasDot) {
    const [intPart, decPart = ''] = result.split('.');
    result = intPart + '.' + decPart.slice(0, 2);
  }

  return result;
}

interface NumberInputProps extends Omit<BaseFieldProps, 'children'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const NumberInput = ({
  containerStyle,
  errorMessage,
  max = 10000, // I think this is a good default value for most cases
  inputStyle,
  value = 0,
  onChange,
  min = 0,
  status,
  label,
}: NumberInputProps) => {
  const [inputStr, setInputStr] = useState<string | null>(null);

  useEffect(() => {
    setInputStr(null);
  }, [value]);

  const displayValue = inputStr !== null ? inputStr : value === 0 ? '0' : value.toString();

  const handleChange = (text: string) => {
    const filtered = filterDecimalInput(text);

    if (filtered === '') {
      setInputStr('');
      onChange(min);
      return;
    }

    const isIntermediate = filtered === '.' || filtered.endsWith('.');
    if (isIntermediate) {
      setInputStr(filtered);
      return;
    }

    const parsed = parseFloat(filtered);
    if (Number.isNaN(parsed)) {
      setInputStr(filtered);
      return;
    }

    const clamped = roundToTwoDecimals(Math.min(max, Math.max(min, parsed)));
    onChange(clamped);
    setInputStr(null);
  };

  const currentNumeric = inputStr !== null ? parseFloat(inputStr) : value;
  const effectiveValue = Number.isNaN(currentNumeric) ? value : currentNumeric;
  const clampedValue = roundToTwoDecimals(Math.min(max, Math.max(min, effectiveValue)));

  const handleIncrement = () => {
    const next = roundToTwoDecimals(clampedValue + 1);
    onChange(Math.min(max, next));
    setInputStr(null);
  };

  const handleDecrement = () => {
    const next = roundToTwoDecimals(clampedValue - 1);
    onChange(Math.max(min, next));
    setInputStr(null);
  };

  return (
    <BaseField label={label} errorMessage={errorMessage} status={status}>
      <View style={[styles.container, containerStyle]}>
        <Pressable
          onPress={handleDecrement}
          disabled={clampedValue <= min}
          style={styles.pressableButton}
        >
          <Subtract opacity={clampedValue > min ? 1 : 0.5} />
        </Pressable>
        <TextInput
          keyboardType="decimal-pad"
          value={displayValue}
          containerStyle={styles.inputContainer}
          status={errorMessage ? 'error' : status}
          style={{ ...styles.input, ...inputStyle }}
          onChangeText={handleChange}
        />
        <Pressable
          onPress={handleIncrement}
          disabled={clampedValue >= max}
          style={styles.pressableButton}
        >
          <Add opacity={clampedValue < max ? 1 : 0.5} />
        </Pressable>
      </View>
    </BaseField>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 2,
    backgroundColor: colors.greyMedium,
  },
  pressableButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexGrow: 1,
    minWidth: 60,
  },
  input: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
    backgroundColor: colors.greyLight,
  },
});

export default NumberInput;
