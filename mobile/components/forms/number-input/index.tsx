import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Pressable } from 'react-native';
import TextInput from '../text-input';
import BaseField, { BaseFieldProps } from '../input-field';
import { Add, Subtract } from '@/components/icons';

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
  const handleChange = (value: number) => {
    if (value < min) {
      onChange(min);
      return
    }

    if (value > max) {
      onChange(max);
      return
    }

    onChange(value);
  };

  return (
    <BaseField label={label} errorMessage={errorMessage} status={status}>
      <View style={[styles.container, containerStyle]}>
        <Pressable onPress={() => onChange(value - 1)} disabled={value <= min} style={styles.pressableButton}>
          <Subtract opacity={value > min ? 1 : 0.5} />
        </Pressable>
        <TextInput
          keyboardType="numeric"
          value={value === 0 ? "0" : value.toString()}
          containerStyle={styles.inputContainer}
          status={errorMessage ? 'error' : status}
          style={{ ...styles.input, ...inputStyle }}
          onChangeText={(text) => handleChange(Number(text))}
        />
        <Pressable onPress={() => handleChange(value + 1)} style={styles.pressableButton}>
          <Add />
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
    backgroundColor: '#485164',
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
    fontWeight: '900',
    fontSize: 16,
    color: 'white',
    backgroundColor: '#61687E',
  },
});

export default NumberInput;
